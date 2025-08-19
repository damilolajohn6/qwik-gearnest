/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const paystackAPI = axios.create({
    baseURL: PAYSTACK_BASE_URL,
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
});

export interface InitializePaymentData {
    email: string;
    amount: number; // in kobo
    currency?: string;
    reference?: string;
    callback_url?: string;
    metadata?: any;
    channels?: string[];
}

export interface PaymentResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface VerifyPaymentResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        message: string | null;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: any;
        log: any;
        fees: number;
        fees_split: any;
        authorization: {
            authorization_code: string;
            bin: string;
            last4: string;
            exp_month: string;
            exp_year: string;
            channel: string;
            card_type: string;
            bank: string;
            country_code: string;
            brand: string;
            reusable: boolean;
            signature: string;
            account_name: string | null;
        };
        customer: {
            id: number;
            first_name: string | null;
            last_name: string | null;
            email: string;
            customer_code: string;
            phone: string | null;
            metadata: any;
            risk_action: string;
            international_format_phone: string | null;
        };
        plan: any;
        split: any;
        order_id: any;
        paidAt: string;
        createdAt: string;
        requested_amount: number;
        pos_transaction_data: any;
        source: any;
        fees_breakdown: any;
    };
}

export const initializePayment = async (data: InitializePaymentData): Promise<PaymentResponse> => {
    try {
        const response = await paystackAPI.post('/transaction/initialize', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Payment initialization failed');
    }
};

export const verifyPayment = async (reference: string): Promise<VerifyPaymentResponse> => {
    try {
        const response = await paystackAPI.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
};

export const generateReference = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `GN_${timestamp}_${random}`.toUpperCase();
};
