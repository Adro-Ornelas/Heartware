import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private http = inject(HttpClient);

    private apiUrl = `http://localhost:3000/api/products`;
    
    // getProducts():Observable<Product[]> {
    //     return this.http.get<Product[]>(this.apiUrl);
    // }

    getProducts(): Observable<Product[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map(dbProducts => dbProducts.map(dbItem => ({
                id: dbItem.id, // o el nombre de tu ID
                name: dbItem.name,
                price: dbItem.price,
                image: dbItem.image,
                category: dbItem.category,
                quantity: dbItem.quantity,
                description: dbItem.description,
                inventoryStatus: dbItem.inventory_status,   // INSTOCK, LOWTOCK, OUTOFSTOCK
                createdAt: dbItem.created_at,
            }
            )))
        );
    }
}
