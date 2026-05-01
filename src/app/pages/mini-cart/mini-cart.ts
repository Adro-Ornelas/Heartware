import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '@/app/services/shoppingcart.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './mini-cart.html',
  styleUrls: ['./mini-cart.css'],

})
export class MiniCart {

  expanded = false;

  constructor(
    public cart: ShoppingCartService,
    private router: Router
  ) {}

  toggle() {
    this.expanded = !this.expanded;
  }

  goToCart() {
    this.router.navigate(['/pages/shoppingcart']);
  }

  totalItems() {
    return this.cart.products().reduce((sum, p) => sum + (p.quantity || 0), 0);
  }
}