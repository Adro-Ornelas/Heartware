import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@/app/models/product.model';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { Signal } from '@angular/core';

@Component({
    selector: 'app-shoppingcart',
    standalone: true,
    imports: [CurrencyPipe],
    templateUrl: './shoppingcart.html',
    styleUrl: './shoppingcart.scss'
})
export class Shoppingcart {
    private shoppingCartService = inject(ShoppingCartService);

    cart: Signal<Product[]> = this.shoppingCartService.products;
    
    total = computed(() => this.shoppingCartService.total());

    removeProduct(id: number) {
        this.shoppingCartService.removeProduct(id);
    }

    empty() {
        this.shoppingCartService.empty();
    }

    exportXML() {
        this.shoppingCartService.exportXML();
    }
}