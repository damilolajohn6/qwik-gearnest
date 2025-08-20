import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models/Order';
import { verifyPayment } from '@/lib/paystack';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json(
                { error: 'Payment reference is required' },
                { status: 400 }
            );
        }

        // Verify payment with Paystack
        const verificationResponse = await verifyPayment(reference);

        if (!verificationResponse.status) {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        const paymentData = verificationResponse.data;

        // Find the order
        const order = await Order.findOne({ paymentReference: reference });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order based on payment status
        if (paymentData.status === 'success') {
            await Order.findByIdAndUpdate(order._id, {
                paymentStatus: 'paid',
                status: 'confirmed',
                paymentDate: new Date(),
                paymentData: {
                    gateway: 'paystack',
                    transactionId: paymentData.id,
                    reference: paymentData.reference,
                    amount: paymentData.amount / 100, // Convert back to naira
                    paidAt: paymentData.paid_at
                }
            });

            return NextResponse.json({
                message: 'Payment verified successfully',
                status: 'success',
                order: {
                    id: order._id,
                    orderNumber: order.orderNumber,
                    status: 'confirmed'
                }
            });
        } else {
            await Order.findByIdAndUpdate(order._id, {
                paymentStatus: 'failed',
                paymentData: {
                    gateway: 'paystack',
                    transactionId: paymentData.id,
                    reference: paymentData.reference,
                    failureReason: paymentData.gateway_response
                }
            });

            return NextResponse.json({
                message: 'Payment failed',
                status: 'failed',
                reason: paymentData.gateway_response
            });
        }
    } catch (error) {
        console.error('Verify payment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
