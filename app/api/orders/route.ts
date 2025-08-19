/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/lib/db';
import {Order} from '@/models/Order';
import {Product} from '@/models/Product';
import { verifyAuth } from '@/lib/auth';

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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');

        // Build query based on user role
        const query: any = {};

        if (authResult.user?.role === 'customer') {
            query.customer = authResult.user.userId;
        }

        if (status) {
            query.status = status;
        }

        // Execute query
        const skip = (page - 1) * limit;
        const orders = await Order.find(query)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name images price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        return NextResponse.json({
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
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

        const { items, shippingAddress, paymentMethod, notes } = await request.json();

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'Order items are required' },
                { status: 400 }
            );
        }

        // Validate shipping address
        if (!shippingAddress) {
            return NextResponse.json(
                { error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        // Calculate totals and validate products
        let subtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.product}` },
                    { status: 404 }
                );
            }

            if (!product.isActive) {
                return NextResponse.json(
                    { error: `Product is not available: ${product.name}` },
                    { status: 400 }
                );
            }

            if (product.inventory < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient inventory for ${product.name}` },
                    { status: 400 }
                );
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            validatedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });
        }

        // Calculate shipping and tax (you can customize these calculations)
        const shippingCost = subtotal > 10000 ? 0 : 2000; // Free shipping over ₦10,000
        const taxRate = 0.075; // 7.5% VAT
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;

        // Generate order number
        const orderNumber = `GN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create order
        const order = await Order.create({
            orderNumber,
            customer: authResult.user?.userId,
            items: validatedItems,
            subtotal,
            tax,
            shippingCost,
            total,
            shippingAddress,
            paymentMethod,
            notes,
            status: 'pending'
        });

        // Update product inventory
        for (const item of validatedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { inventory: -item.quantity }
            });
        }

        // Populate order details
        await order.populate([
            {
                path: 'customer',
                select: 'name email phone'
            },
            {
                path: 'items.product',
                select: 'name images price'
            }
        ]);

        return NextResponse.json(
            {
                message: 'Order created successfully',
                order
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
