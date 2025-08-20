import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import User from '@/models/User';
import { Category } from '@/models/Category';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        // Only admins can view stats
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '30'; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Get basic counts
        const [
            totalProducts,
            totalCustomers,
            totalCategories,
            totalOrders,
            recentOrders,
            paidOrders
        ] = await Promise.all([
            Product.countDocuments({ isActive: true }),
            User.countDocuments({ role: 'customer' }),
            Category.countDocuments({ isActive: true }),
            Order.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: startDate } }),
            Order.countDocuments({ paymentStatus: 'paid' })
        ]);

        // Get revenue statistics
        const revenueStats = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    averageOrderValue: { $avg: '$total' }
                }
            }
        ]);

        const recentRevenueStats = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    recentRevenue: { $sum: '$total' },
                    recentOrders: { $sum: 1 }
                }
            }
        ]);

        // Get order status distribution
        const orderStatusStats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get top-selling products
        const topProducts = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.total' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' }
        ]);

        // Get sales trend (daily sales for the period)
        const salesTrend = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt'
                        }
                    },
                    sales: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Get category performance
        const categoryStats = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product.category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: '$category.name',
                    totalSales: { $sum: '$items.total' },
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        return NextResponse.json({
            overview: {
                totalProducts,
                totalCustomers,
                totalCategories,
                totalOrders,
                paidOrders,
                recentOrders,
                totalRevenue: revenueStats[0]?.totalRevenue || 0,
                averageOrderValue: revenueStats[0]?.averageOrderValue || 0,
                recentRevenue: recentRevenueStats[0]?.recentRevenue || 0
            },
            orderStatusStats,
            topProducts,
            salesTrend,
            categoryStats,
            period: parseInt(period)
        });
    } catch (error) {
        console.error('Get stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}