import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreateOrderPayload, PurchaseOrder } from '../models/order.model';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    private http = inject(HttpClient);
    private usersService = inject(UsersService);
    private base = this.resolveApiBase();

    getOrdersByUser(idUser: number): Observable<PurchaseOrder[]> {
        console.log('Consultando órdenes para:', idUser);
        return this.http.get<PurchaseOrder[]>(`${this.base}/orders/user/${idUser}`).pipe(
            map((orders) =>
                orders.map((order) => ({
                    ...order,
                    price: Number(order.price),
                    products: (order.products || []).filter((product) => product?.id)
                }))
            )
        );
    }

      getAllOrders(): Observable<PurchaseOrder[]> {
        console.log('Consultando órdenes');
        return this.http.get<PurchaseOrder[]>(`${this.base}/orders/all`).pipe(
            map((orders) =>
                orders.map((order) => ({
                    ...order,
                    price: Number(order.price),
                    products: (order.products || []).filter((product) => product?.id)
                }))
            )
        );
    }

    createOrder(payload: CreateOrderPayload): Observable<PurchaseOrder> {
        return this.http.post<PurchaseOrder>(`${this.base}/orders`, payload);
    }

    getCurrentUserId(): number | null {
        return this.usersService.getCurrentUserId();
    }

    private resolveApiBase(): string {
        try {
            const host = window.location.hostname;

            if (host === 'localhost' || host === '127.0.0.1') {
                return 'http://localhost:3000/api';
            }
        } catch {
            return '/api';
        }

        return '/api';
    }
}
