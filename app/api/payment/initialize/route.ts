import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/lib/db';
import {Order} from '@/models/Order';
import { verifyAuth } from '@/lib/auth';
import { initializePayment } from '@/lib/paystack';

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

        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Find the order
        const order = await Order.findOne({
            _id: orderId,
            customer: authResult.user?.userId
        }).populate('customer', 'name email');

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if order is already paid or cancelled
        if (order.paymentStatus === 'paid') {
            return NextResponse.json(
                { error: 'Order is already paid' },
                { status: 400 }
            );
        }

        if (order.status === 'cancelled') {
            return NextResponse.json(
                { error: 'Cannot pay for cancelled order' },
                { status: 400 }
            );
        }

        // Initialize payment with Paystack
        const paymentData = {
            email: order.customer.email,
            amount: Math.round(order.total * 100), // Convert to kobo
            reference: `${order.orderNumber}_${Date.now()}`,
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
            metadata: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                customerName: order.customer.name
            }
        };

        const paymentResponse = await initializePayment(paymentData);

        if (!paymentResponse.status) {
            return NextResponse.json(
                { error: 'Failed to initialize payment' },
                { status: 500 }
            );
        }

        // Update order with payment reference
        await Order.findByIdAndUpdate(orderId, {
            paymentReference: paymentData.reference,
            paymentStatus: 'pending'
        });

        return NextResponse.json({
            message: 'Payment initialized successfully',
            data: paymentResponse.data
        });
    } catch (error) {
        console.error('Initialize payment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
