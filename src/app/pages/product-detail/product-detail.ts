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
@Component({
    selector: 'app-product-detail',
        standalone: true,
        imports: [CommonModule, InputNumberModule, ButtonModule, FormsModule, LottieComponent, MiniCart],
    templateUrl: './product-detail.html'
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
        private router: Router
    ) { }

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.product$ = this.productService.getProducts().pipe(
            map(products => products.find(p => p.id === id))
        );
    }

    addToCart(product: Product) {
         this.showOverlay = true;
        const quantityToAdd = this.quantity;

        for (let i = 0; i < quantityToAdd; i++) {
            this.cartService.add(product);
        }

        setTimeout(() => {
            this.router.navigate(['/pages/shoppingcart']);
        }, this.overlayDuration); 
    }

}