import { Product } from './product.model';

export type OrderState = 'accepted' | 'rejected' | 'cancelled' | 'error';

export interface PurchaseOrder {
    id_order: number;
    id_user: number;
    user_order_number?: number;

    payment_method: string;
    state: OrderState;
    date: string;
    price: number;

    customer_name?: string;
    street?: string;
    city?: string;
    state_address?: string;
    postal_code?: string;
    country?: string;

    products: Product[];
}

export interface CreateOrderPayload {
    id_user: number;

    payment_method: string;
    paypal_status?: string;
    state?: OrderState;

    customer_name?: string;
    street?: string;
    city?: string;
    state_address?: string;
    postal_code?: string;
    country?: string;

    price: number;

    products: Array<{
        id_product: number;
        quantity: number;
    }>;
}