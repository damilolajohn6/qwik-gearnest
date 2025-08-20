/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import  connectDB  from '@/lib/db';
import {Order} from '@/models/Order';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.text();
        const signature = request.headers.get('x-paystack-signature');

        // Verify webhook signature
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest('hex');

        if (hash !== signature) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);

        // Handle different webhook events
        switch (event.event) {
            case 'charge.success':
                await handleSuccessfulPayment(event.data);
                break;

            case 'charge.failed':
                await handleFailedPayment(event.data);
                break;

            default:
                console.log(`Unhandled webhook event: ${event.event}`);
        }

        return NextResponse.json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleSuccessfulPayment(data: any) {
    try {
        const order = await Order.findOne({ paymentReference: data.reference });

        if (order && order.paymentStatus !== 'paid') {
            await Order.findByIdAndUpdate(order._id, {
                paymentStatus: 'paid',
                status: 'confirmed',
                paymentDate: new Date(),
                paymentData: {
                    gateway: 'paystack',
                    transactionId: data.id,
                    reference: data.reference,
                    amount: data.amount / 100,
                    paidAt: data.paid_at
                }
            });

            // TODO: Send confirmation email to customer
            // TODO: Notify admin of new paid order

            console.log(`Payment confirmed for order: ${order.orderNumber}`);
        }
    } catch (error) {
        console.error('Handle successful payment error:', error);
    }
}

async function handleFailedPayment(data: any) {
    try {
        const order = await Order.findOne({ paymentReference: data.reference });

        if (order && order.paymentStatus === 'pending') {
            await Order.findByIdAndUpdate(order._id, {
                paymentStatus: 'failed',
                paymentData: {
                    gateway: 'paystack',
                    transactionId: data.id,
                    reference: data.reference,
                    failureReason: data.gateway_response
                }
            });

            console.log(`Payment failed for order: ${order.orderNumber}`);
        }
    } catch (error) {
        console.error('Handle failed payment error:', error);
    }
}