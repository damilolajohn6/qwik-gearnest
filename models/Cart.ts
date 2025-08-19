import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
    product: string;
    quantity: number;
    price: number;
    variant?: string;
}

export interface ICart extends Document {
    _id: string;
    sessionId?: string;
    user?: string;
    items: ICartItem[];
    totalItems: number;
    totalAmount: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
    sessionId: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        variant: String
    }],
    totalItems: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
}, {
    timestamps: true
});

CartSchema.index({ sessionId: 1 });
CartSchema.index({ user: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
