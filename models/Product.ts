import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    costPerItem?: number;
    sku: string;
    barcode?: string;
    trackQuantity: boolean;
    quantity: number;
    continueSellingWhenOutOfStock: boolean;
    images: string[];
    category: Types.ObjectId;
    tags: string[];
    variants?: {
        name: string;
        options: string[];
    }[];
    specifications?: {
        [key: string]: string;
    };
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    isActive: boolean;
    isFeatured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    rating: number;
    reviewCount: number;
    soldCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    costPerItem: { type: Number, min: 0 },
    sku: { type: String, required: true, unique: true },
    barcode: String,
    trackQuantity: { type: Boolean, default: true },
    quantity: { type: Number, default: 0, min: 0 },
    continueSellingWhenOutOfStock: { type: Boolean, default: false },
    images: [{ type: String, required: true }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [String],
    variants: [{
        name: { type: String, required: true },
        options: [{ type: String, required: true }]
    }],
    specifications: { type: Map, of: String },
    weight: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    seoTitle: String,
    seoDescription: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    soldCount: { type: Number, default: 0, min: 0 },
}, {
    timestamps: true
});

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
