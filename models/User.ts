import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    role: 'admin' | 'customer';
    isVerified: boolean;
    avatar?: string;
    dateOfBirth?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'Nigeria' }
    },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    isVerified: { type: Boolean, default: false },
    avatar: String,
    dateOfBirth: Date,
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
