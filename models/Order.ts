import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
    product: Types.ObjectId; // Use Types.ObjectId instead of string
    name: string;
    price: number;
    quantity: number;
    image: string;
    sku: string;
}

export interface IOrder extends Document {
    _id: string;
    orderNumber: string;
    customer: Types.ObjectId; // Use Types.ObjectId instead of string
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    currency: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: string;
    paymentReference?: string;
    paystackReference?: string;
    shippingAddress: {
        name: string;
        email: string;
        phone: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    billingAddress?: {
        name: string;
        email: string;
        phone: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    notes?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
    refundedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        sku: { type: String, required: true }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'NGN' },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: { type: String, required: true },
    paymentReference: String,
    paystackReference: String,
    shippingAddress: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: String,
        country: { type: String, default: 'Nigeria' }
    },
    billingAddress: {
        name: String,
        email: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    notes: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    refundedAt: Date,
}, {
    timestamps: true
});

OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderNumber: 1 });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
