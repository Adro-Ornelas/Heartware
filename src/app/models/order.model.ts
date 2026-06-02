import { Product } from './product.model';

export type OrderState = 'accepted' | 'rejected' | 'cancelled' | 'error';

export interface PurchaseOrder {
    id_order: number;
    id_user: number;
    payment_method: string;
    state: OrderState;
    date: string;
    price: number;
    products: Product[];
}

export interface CreateOrderPayload {
    id_user: number;
    payment_method: string;
    paypal_status?: string;
    state?: OrderState;
    price: number;
    products: Array<{ id_product: number; quantity: number }>;
}
