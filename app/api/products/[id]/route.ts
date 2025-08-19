import { NextRequest, NextResponse } from 'next/server';
import connectDB  from '@/lib/db';
import { Product } from '@/models/Product';
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
        await connectDB();

        const product = await Product.findById(params.id)
            .populate('category', 'name slug');

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Increment view count
        await Product.findByIdAndUpdate(params.id, {
            $inc: { views: 1 }
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
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
        // Verify admin authentication
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const updateData = await request.json();

        // If name is being updated, update slug too
        if (updateData.name) {
            const slug = updateData.name.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();

            // Check if slug already exists (excluding current product)
            const existingProduct = await Product.findOne({
                slug,
                _id: { $ne: params.id }
            });

            if (existingProduct) {
                return NextResponse.json(
                    { error: 'Product with this name already exists' },
                    { status: 409 }
                );
            }

            updateData.slug = slug;
        }

        const product = await Product.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        ).populate('category', 'name slug');

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
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
        // Verify admin authentication
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const product = await Product.findByIdAndDelete(params.id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
