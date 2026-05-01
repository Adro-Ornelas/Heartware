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
import { ShoppingCartService } from '@/app/services/shoppingcart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { LottieComponent } from 'ngx-lottie';
import { MiniCart } from '../mini-cart/mini-cart';
@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, TagModule, ButtonModule, 
        TableModule, ToastModule, RouterModule, DialogModule, LottieComponent, MiniCart],
    templateUrl: './catalog.html',
    styleUrls: ['./catalog.css'],
    providers: [ProductService, MessageService]
})
export class Catalog {
    showSuccess = false;
    // products: Product[] = []; Versión vieja, necesita ser Observable para cargar correctamente
    products$: Observable<Product[]>;

    constructor(private productService: ProductService, private shoppingCartService: ShoppingCartService) {
        this.products$ = this.productService.getProducts();
    }

    add(product: Product) {
        this.animatingId = product.id;

        setTimeout(() => {
            this.shoppingCartService.add(product);
            this.animatingId = null;
        }, this.animationDuration);
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

    animatingId: number | null = null;
    animationDuration = 2500;

    lottieOptions = {
        path: 'https://lottie.host/7d340901-6f1b-4237-9c8c-695eb40d9a88/obUmmBEoh8.json',
    };

    // helpers
    isAnimating(product: Product) {
        return this.animatingId === product.id;
    }

    isInCart(product: Product) {
        return this.shoppingCartService.exists(product.id);
    }

    getQuantity(product: Product) {
        return this.shoppingCartService.getQuantity(product.id);
    }

    increase(product: Product) {
        this.shoppingCartService.increase(product.id);
    }

    decrease(product: Product) {
        this.shoppingCartService.decrease(product.id);
    }


}
