import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs'; // <-- Asegúrate de importar 'tap'
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = `http://localhost:3000/api/products`;

    getProducts(): Observable<Product[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map(dbProducts => dbProducts.map(dbItem => {
                const stockDeBaseDatos = dbItem.quantity !== undefined ? dbItem.quantity : (dbItem.stock !== undefined ? dbItem.stock : 0);
                const estadoDeBaseDatos = dbItem.inventoryStatus || dbItem.inventory_status || 'INSTOCK';

                return {
                    id: dbItem.id,
                    name: dbItem.name,
                    price: Number(dbItem.price) || 0,
                    image: dbItem.image,
                    category: dbItem.category,
                    quantity: Number(stockDeBaseDatos),
                    inventoryStatus: String(estadoDeBaseDatos).toUpperCase().trim(),
                    description: dbItem.description,
                    createdAt: dbItem.created_at || dbItem.createdAt
                };
            }))
        );
    }
}