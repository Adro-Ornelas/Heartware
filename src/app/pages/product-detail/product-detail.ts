import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@/app/services/products.service';
import { ShoppingCartService } from '@/app/services/shoppingcart.service';
import { Product } from '@/app/models/product.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';
import { MiniCart } from '../mini-cart/mini-cart';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, InputNumberModule, ButtonModule, FormsModule, LottieComponent, MiniCart,DialogModule, ToastModule, TagModule],
    templateUrl: './product-detail.html',
    providers: [MessageService]
})
export class ProductDetail {

    showOverlay = false;
    overlayDuration = 2500;
    lottieOptions = {
        path: 'https://lottie.host/7d340901-6f1b-4237-9c8c-695eb40d9a88/obUmmBEoh8.json'
    };

    product$!: Observable<Product | undefined>;
    quantity: number = 1;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: ShoppingCartService,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.product$ = this.productService.getProducts().pipe(
            map(products => products.find(p => p.id === id))
        );
    }

    addToCart(product: Product) {

        const alreadyInCart =
            this.cartService.getQuantity(product.id);

        if (
            alreadyInCart + this.quantity >
            product.quantity
        ) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Límite alcanzado', 
                detail: `No puedes agregar más de ${product.quantity} unidades.` 
            });

            return;
        }

        for (let i = 0; i < this.quantity; i++) {
            this.cartService.add(product);
        }
        this.messageService.add({ 
                severity: 'success', 
                summary: 'Producto agregado', 
                detail: `Se ha agregado ${this.quantity} unidades de ${product.name}.` 
            });
        this.showOverlay = false;

        setTimeout(() => {
            this.showOverlay = false;
        }, this.overlayDuration);
    }

    getSeverity(product: Product) {
        const status = (product.inventoryStatus || '').toUpperCase().trim();
        switch (status) {
            case 'INSTOCK':
                return 'success'; // Verde
            case 'LOWSTOCK':
                return 'warn';    // Amarillo
            case 'OUTOFSTOCK':
                return 'danger';  // Rojo
            default:
                return 'info';
        }
    }

}