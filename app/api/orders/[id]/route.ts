/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
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

        const query: any = { _id: params.id };

        // If customer, only allow access to their own orders
        if (authResult.user?.role === 'customer') {
            query.customer = authResult.user.userId;
        }

        const order = await Order.findOne(query)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name images price');

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: RouteParams
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

        const updateData = await request.json();

        const query: any = { _id: params.id };

        // If customer, only allow limited updates to their own orders
        if (authResult.user?.role === 'customer') {
            query.customer = authResult.user.userId;

            // Customers can only cancel pending orders
            if (updateData.status && updateData.status !== 'cancelled') {
                return NextResponse.json(
                    { error: 'Customers can only cancel orders' },
                    { status: 403 }
                );
            }

            // Check if order is cancellable
            const existingOrder = await Order.findOne(query);
            if (!existingOrder) {
                return NextResponse.json(
                    { error: 'Order not found' },
                    { status: 404 }
                );
            }

            if (existingOrder.status !== 'pending') {
                return NextResponse.json(
                    { error: 'Order cannot be cancelled' },
                    { status: 400 }
                );
            }
        }

        const order = await Order.findOneAndUpdate(
            query,
            updateData,
            { new: true }
        )
            .populate('customer', 'name email phone')
            .populate('items.product', 'name images price');

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // Only admins can delete orders
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const order = await Order.findByIdAndDelete(params.id);

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
