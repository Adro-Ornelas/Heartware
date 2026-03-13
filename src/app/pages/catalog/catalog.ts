import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
// import { Product, ProductService } from '@/app/pages/service/product.service';
import { Product } from '@/app/models/product.model';
import { ProductService } from '@/app/services/products.service';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, TagModule, ButtonModule, TableModule],
    templateUrl: './catalog.html',
    styleUrls: ['./catalog.css'],
    providers: [ProductService]
})
export class Catalog {
    // products: Product[] = []; Versión vieja, necesita ser Observable para cargar correctamente
    products$: Observable<Product[]>;

    constructor(private productService: ProductService) {
        this.products$ = this.productService.getProducts();
    }

    ngOnInit() {
        // TESTING
        // this.products = [
        //     {
        //         id: 1,
        //         name: 'Prueba',
        //         price: 1,
        //         image: 'lovebox-1.webp',
        //         category: 'Prueba',
        //         quantity: 1,
        //         description: 'Desc',
        //         inventoryStatus: 'INSTOCK'
        //     }
        // ];

        // this.productService.getProducts().subscribe({
        //     next: (data) => {
        //         this.products = data;
        //         this.loading = false; // Data arrived, stop loading
        //     },
        //     error: (err) => {
        //         console.error('Error cargando XML: ', err);
        //         this.loading = false; // Stop loading even on error
        //     }
        // });
    }

    getSeverity(product: Product) {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warn';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return 'info';
        }
    }
}
