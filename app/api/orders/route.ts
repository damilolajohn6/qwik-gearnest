/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyAuth(request);
        
        if (!authResult.success) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const query: any = { user: authResult.user.userId };
        if (status && status !== 'all') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const [orders, totalCount] = await Promise.all([
            Order.find(query)
                .populate('items.product', 'name image slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query)
        ]);

        return NextResponse.json({
            orders: JSON.parse(JSON.stringify(orders)),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalOrders: totalCount,
                hasNext: page < Math.ceil(totalCount / limit),
                hasPrev: page > 1,
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyAuth(request);
        
        if (!authResult.success) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const orderData = await request.json();
        const {
            items,
            shippingAddress,
            billingAddress,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            discount,
            totalAmount,
            notes
        } = orderData;

        // Generate order number
        const orderNumber = `GN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const order = new Order({
            orderNumber,
            user: authResult.user.userId,
            items,
            shippingAddress,
            billingAddress,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            discount,
            totalAmount,
            notes,
            status: 'pending'
        });

        await order.save();

        // Populate the order with product details
        await order.populate('items.product', 'name image slug');

        return NextResponse.json({
            message: 'Order created successfully',
            order: JSON.parse(JSON.stringify(order))
        }, { status: 201 });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}