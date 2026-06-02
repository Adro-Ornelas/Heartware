import { Component, OnInit, signal } from '@angular/core';
import { OrdersService } from '@/app/services/orders.service';
import { PurchaseOrder } from '@/app/models/order.model';
import { Product } from '@/app/models/product.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-orders-crud',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule, TagModule, RouterModule],
    templateUrl: './orders.crud.html'
})
export class OrdersCrud implements OnInit {
    orders = signal<PurchaseOrder[]>([]);
    selectedOrderProducts = signal<Product[]>([]);
    displayProductsDialog: boolean = false;

    constructor(private ordersService: OrdersService) {}

    ngOnInit() {
        const userId = this.ordersService.getCurrentUserId();
        if (userId) {

            this.ordersService.getAllOrders().subscribe(data => {
                // Ordenar por fecha descendente (más reciente primero)
                const sorted = data.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                this.orders.set(sorted);
            });
        }
    }

    selectedOrder = signal<PurchaseOrder | null>(null);

    showProducts(order: PurchaseOrder) {
        this.selectedOrder.set(order);
        this.selectedOrderProducts.set(order.products);
        this.displayProductsDialog = true;
    }

    getSeverity(state: string): 'success' | 'danger' | 'warn' | 'info' {
        switch (state) {
            case 'accepted': return 'success';
            case 'rejected': return 'danger';
            case 'cancelled': return 'warn';
            default: return 'info';
        }
    }
    
}