import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentCategory?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, {
    timestamps: true
});

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
