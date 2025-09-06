import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface IPaymentMethod {
    type: string;
    last4?: string;
    transactionId?: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    user: mongoose.Types.ObjectId;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    billingAddress?: IShippingAddress;
    paymentMethod: IPaymentMethod;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    totalAmount: number;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const PaymentMethodSchema = new Schema<IPaymentMethod>({
    type: {
        type: String,
        required: true
    },
    last4: {
        type: String
    },
    transactionId: {
        type: String
    }
});

const OrderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    items: [OrderItemSchema],
    shippingAddress: {
        type: ShippingAddressSchema,
        required: true
    },
    billingAddress: {
        type: ShippingAddressSchema
    },
    paymentMethod: {
        type: PaymentMethodSchema,
        required: true
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        min: 0
    },
    shipping: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    trackingNumber: {
        type: String
    },
    estimatedDelivery: {
        type: Date
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Index for better query performance
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export { Order };
export default Order;