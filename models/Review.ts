import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
    _id: string;
    product: Types.ObjectId; // Use Types.ObjectId instead of string
    user: Types.ObjectId; // Use Types.ObjectId instead of string
    rating: number;
    title: string;
    comment: string;
    verified: boolean;
    helpful: number;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    images: [String],
}, {
    timestamps: true
});

ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
