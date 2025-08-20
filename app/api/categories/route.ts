/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const includeProductCount = searchParams.get('includeProductCount') === 'true';

        let categories = await Category.find({ isActive: true })
            .sort({ name: 1 });

        // Include product count if requested
        if (includeProductCount) {
            categories = await Promise.all(
                categories.map(async (category: { _id: any; toObject: () => any; }) => {
                    const productCount = await Product.countDocuments({
                        category: category._id,
                        isActive: true
                    });

                    return {
                        ...category.toObject(),
                        productCount
                    };
                })
            );
        }

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Only admins can create categories
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { name, description, image } = await request.json();

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        // Create slug from name
        const slug = name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        // Check if category already exists
        const existingCategory = await Category.findOne({
            $or: [{ name }, { slug }]
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category already exists' },
                { status: 409 }
            );
        }

        // Create category
        const category = await Category.create({
            name,
            slug,
            description,
            image,
            isActive: true
        });

        return NextResponse.json(
            {
                message: 'Category created successfully',
                category
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create category error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Only admins can update categories
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { id, name, description, image, isActive } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Category ID is required' },
                { status: 400 }
            );
        }

        const updateData: any = { description, image, isActive };

        // If name is being updated, update slug too
        if (name) {
            const slug = name.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();

            // Check if name/slug already exists (excluding current category)
            const existingCategory = await Category.findOne({
                $or: [{ name }, { slug }],
                _id: { $ne: id }
            });

            if (existingCategory) {
                return NextResponse.json(
                    { error: 'Category name already exists' },
                    { status: 409 }
                );
            }

            updateData.name = name;
            updateData.slug = slug;
        }

        const category = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        console.error('Update category error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Only admins can delete categories
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Category ID is required' },
                { status: 400 }
            );
        }

        // Check if category has products
        const productCount = await Product.countDocuments({ category: id });
        if (productCount > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with existing products' },
                { status: 400 }
            );
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
