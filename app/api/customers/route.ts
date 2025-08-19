/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import  User  from '@/models/User';
import { Order } from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build query
        const query: any = { role: 'customer' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const skip = (page - 1) * limit;
        const customers = await User.find(query)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get order statistics for each customer
        const customersWithStats = await Promise.all(
            customers.map(async (customer: { _id: any; toObject: () => any; }) => {
                const orderStats = await Order.aggregate([
                    { $match: { customer: customer._id } },
                    {
                        $group: {
                            _id: null,
                            totalOrders: { $sum: 1 },
                            totalSpent: { $sum: '$total' },
                            lastOrderDate: { $max: '$createdAt' }
                        }
                    }
                ]);

                return {
                    ...customer.toObject(),
                    orderStats: orderStats[0] || {
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrderDate: null
                    }
                };
            })
        );

        const total = await User.countDocuments(query);

        return NextResponse.json({
            customers: customersWithStats,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCustomers: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Get customers error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
