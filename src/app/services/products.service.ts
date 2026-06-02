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

    // 1. Obtener todos los productos (Mapeo de Entrada)
    getProducts(): Observable<Product[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
    //         map(dbProducts => dbProducts.map(dbItem => {
    //             const stockDeBaseDatos = dbItem.quantity !== undefined ? dbItem.quantity : (dbItem.stock !== undefined ? dbItem.stock : 0);
    //             const estadoDeBaseDatos = dbItem.inventoryStatus || dbItem.inventory_status || 'INSTOCK';

    //             return {
    //                 id: dbItem.id,
    //                 name: dbItem.name,
    //                 price: Number(dbItem.price) || 0,
    //                 image: dbItem.image,
    //                 category: dbItem.category,
    //                 quantity: Number(stockDeBaseDatos),
    //                 inventoryStatus: String(estadoDeBaseDatos).toUpperCase().trim(),
    //                 description: dbItem.description,
    //                 createdAt: dbItem.created_at || dbItem.createdAt
    //             };
    //         }))
    //     );
    // }
            map(dbProducts => dbProducts.map(dbItem => this.convertToFrontend(dbItem)))
        );
    }

    // 2. Crear un nuevo producto (Mapeo de Salida)
    createProduct(product: Product): Observable<Product> {
        const body = this.convertToBackend(product);
        return this.http.post<any>(this.apiUrl, body).pipe(
            map(dbItem => this.convertToFrontend(dbItem))
        );
    }

    // 3. Actualizar un producto existente
    updateProduct(product: Product): Observable<Product> {
        const body = this.convertToBackend(product);
        return this.http.put<any>(`${this.apiUrl}/${product.id}`, body).pipe(
            map(dbItem => this.convertToFrontend(dbItem))
        );
    }

    // 4. Eliminar un producto
    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // --- Helpers de Mapeo (Aíslan la lógica de la Base de Datos del Frontend) ---
    private convertToFrontend(dbItem: any): Product {
        return {
            id: dbItem.id,
            name: dbItem.name,
            price: Number(dbItem.price),
            image: dbItem.image,
            category: dbItem.category,
            quantity: dbItem.quantity,
            description: dbItem.description,
            inventoryStatus: dbItem.inventory_status, // snake to camel
            createdAt: dbItem.created_at
        };
    }

    private convertToBackend(product: Product): any {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: product.quantity,
            description: product.description,
            inventory_status: product.inventoryStatus, // camel to snake
            created_at: product.createdAt
        };
    }
}