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
    providers: [MessageService]
})
export class Catalog {
    showSuccess = false;
    // products: Product[] = []; Versión vieja, necesita ser Observable para cargar correctamente
    products$: Observable<Product[]>;

    constructor(private productService: ProductService, private shoppingCartService: ShoppingCartService, private messageService: MessageService) {
        this.products$ = this.productService.getProducts();
    }

    add(product: Product) {
        // 1. Verificamos cuántos hay en el carrito actualmente
        const alreadyInCart = this.shoppingCartService.getQuantity(product.id);

        // 2. Validamos contra el stock de la base de datos
        if (alreadyInCart >= product.quantity) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Stock máximo',
                detail: `Solo hay ${product.quantity} unidades disponibles de ${product.name}`
            });
            return; // Detenemos la ejecución aquí
        }

        // 3. Si hay stock, procedemos con la animación y agregamos al carrito
        this.animatingId = product.id;

        setTimeout(() => {
            this.shoppingCartService.add(product);
            this.animatingId = null;
        }, this.animationDuration);
    }

    getSeverity(product: Product) {
        // Limpiamos el texto por si viene con alguna variación de la BD
        const status = (product.inventoryStatus || '').toUpperCase().trim();
        
        switch (status) {
            case 'INSTOCK':
                return 'success'; // Verde

            case 'LOWSTOCK':
                return 'warn';    // Amarillo

            case 'OUTOFSTOCK':
                return 'danger';  // Rojo

            default:
                return 'info';    // Azul 
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
        // 1. Consultamos cuánto lleva el usuario agregado de este producto
        const alreadyInCart = this.getQuantity(product);

        // 2. Si ya alcanzó o superó el stock de la base de datos, mostramos Toast y frenamos
        if (alreadyInCart >= product.quantity) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Stock máximo',
                detail: `Solo hay ${product.quantity} unidades disponibles de ${product.name}`
            });
            return;
        }

        // 3. Si tiene disponibilidad, incrementamos
        this.shoppingCartService.increase(product.id, product.quantity);
    }


    decrease(product: Product) {
        this.shoppingCartService.decrease(product.id);
    }

    getInventoryStatus(product: Product): 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK' {
        if (product.quantity <= 0) {
            return 'OUTOFSTOCK';
        }
        if (product.quantity < 5) {
            return 'LOWSTOCK';
        }
        return 'INSTOCK';
    }


}
