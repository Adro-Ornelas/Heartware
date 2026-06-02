import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { PurchaseOrder, OrderState } from '@/app/models/order.model';
import { OrdersService } from '@/app/services/orders.service';

import { DataViewModule } from 'primeng/dataview';
import { AccordionModule } from 'primeng/accordion';

@Component({
    selector: 'app-purchase-history',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DatePipe, ButtonModule, TagModule, TimelineModule, DataViewModule, AccordionModule],
    templateUrl: './purchase-history.html',
    styleUrl: './purchase-history.scss'
})
export class PurchaseHistory {
    private ordersService = inject(OrdersService);

    orders = signal<PurchaseOrder[]>([]);
    loading = signal(false);
    error = signal('');

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.loading.set(true);
        this.error.set('');

        const idUser = this.ordersService.getCurrentUserId();

        console.log('ID Usuario:', idUser);

        if (!idUser) {
            this.error.set('Debes iniciar sesión.');
            this.loading.set(false);
            return;
        }

        this.ordersService.getOrdersByUser(idUser).subscribe({
            next: (orders) => {
                console.log('Órdenes recibidas:', orders);

                this.orders.set(orders);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error al cargar órdenes:', err);

                this.error.set('No se pudo cargar tu historial de compras.');
                this.loading.set(false);
            }
        });
    }

    getStateLabel(state: OrderState): string {
        const labels: Record<OrderState, string> = {
            accepted: 'Aceptada',
            rejected: 'Rechazada',
            cancelled: 'Cancelada',
            error: 'Con error'
        };

        return labels[state] || state;
    }

    getStateSeverity(state: OrderState) {
        switch (state) {
            case 'accepted':
                return 'success';
            case 'rejected':
                return 'danger';
            case 'cancelled':
                return 'warn';
            default:
                return 'secondary';
        }
    }

    getStateIcon(state: OrderState): string {
        switch (state) {
            case 'accepted':
                return 'pi pi-check-circle';
            case 'rejected':
                return 'pi pi-times-circle';
            case 'cancelled':
                return 'pi pi-ban';
            default:
                return 'pi pi-exclamation-triangle';
        }
    }
}
