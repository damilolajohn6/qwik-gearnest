/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
}

export const uploadImage = async (
    file: string | Buffer,
    options: {
        folder?: string;
        transformation?: any;
        public_id?: string;
        format?: string;
    } = {}
): Promise<UploadResult> => {
    try {
        let fileString: string;
        if (Buffer.isBuffer(file)) {
            const format = options.format || 'png';
            fileString = `data:image/${format};base64,${file.toString('base64')}`;
        } else {
            fileString = file;
        }

        const result = await cloudinary.uploader.upload(fileString, {
            folder: options.folder || 'gearnset',
            transformation: options.transformation,
            public_id: options.public_id,
            resource_type: 'auto',
        });

        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Image upload failed');
    }
};

export const deleteImage = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Image deletion failed');
    }
};

export const generateImageUrl = (
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string;
        format?: string;
    } = {}
): string => {
    return cloudinary.url(publicId, {
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto',
        format: options.format || 'auto',
    });
};
