import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaypalOrderItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface CreatePaypalOrderPayload {
  total: number | string;
  items: PaypalOrderItem[];
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base: string;

  constructor(private http: HttpClient) {
    // During local development prefer calling the backend directly
    // (covers localhost and 127.0.0.1 regardless of port) to avoid the dev server
    // serving index.html for unknown /api paths which causes JSON parse errors.
    try {
      const host = (window as any).location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        this.base = 'http://localhost:3000/api/paypal';
      } else {
        this.base = '/api/paypal';
      }
    } catch (e) {
      this.base = '/api/paypal';
    }
  }

  getClientId(): Observable<{ clientId: string }> {
    return this.http.get<{ clientId: string }>(`${this.base}/config`);
  }

  createOrder(payload: CreatePaypalOrderPayload): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/create-order`, payload);
  }

  captureOrder(orderId: string): Observable<any> {
    return this.http.post<any>(`${this.base}/capture-order/${orderId}`, {});
  }
}