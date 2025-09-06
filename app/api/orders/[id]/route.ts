/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

// GET /api/orders/[id] - Get specific order
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await verifyAuth(request);
        
        if (!authResult.success) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const order = await Order.findOne({
            _id: params.id,
            user: authResult.user.userId
        })
            .populate('items.product', 'name image slug')
            .lean();

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            order: JSON.parse(JSON.stringify(order))
        });
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/orders/[id] - Update order status (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await verifyAuth(request);
        
        if (!authResult.success) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        if (authResult.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        await connectDB();

        const updateData = await request.json();
        const { status, trackingNumber, estimatedDelivery, notes } = updateData;

        const order = await Order.findByIdAndUpdate(
            params.id,
            {
                status,
                trackingNumber,
                estimatedDelivery,
                notes,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('items.product', 'name image slug');

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Order updated successfully',
            order: JSON.parse(JSON.stringify(order))
        });
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await verifyAuth(request);
        
        if (!authResult.success) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const order = await Order.findOne({
            _id: params.id,
            user: authResult.user.userId
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Only allow cancellation if order is pending or processing
        if (!['pending', 'processing'].includes(order.status)) {
            return NextResponse.json(
                { error: 'Order cannot be cancelled' },
                { status: 400 }
            );
        }

        order.status = 'cancelled';
        order.updatedAt = new Date();
        await order.save();

        return NextResponse.json({
            message: 'Order cancelled successfully',
            order: JSON.parse(JSON.stringify(order))
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}