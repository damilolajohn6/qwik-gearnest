import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {
        // Verify authentication (admins can upload product images, customers can upload profile images)
        const authResult = await verifyAuth(request);
        if (!authResult.success) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'general';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size too large. Maximum size is 5MB' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await uploadImage(buffer, {
            folder: `gearnest/${folder}`,
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { format: 'auto' }
            ]
        });

        return NextResponse.json({
            message: 'File uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Only admins can delete uploaded files
        const authResult = await verifyAuth(request);
        if (!authResult.success || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json(
                { error: 'Public ID is required' },
                { status: 400 }
            );
        }

        // Delete from Cloudinary
        await deleteImage(publicId);
        return NextResponse.json({
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete upload error:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
