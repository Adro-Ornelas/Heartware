import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { PurchaseOrder, OrderState } from '@/app/models/order.model';
import { OrdersService } from '@/app/services/orders.service';

@Component({
    selector: 'app-purchase-history',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DatePipe, ButtonModule, TagModule, TimelineModule],
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

        this.ordersService.getOrdersByUser(this.ordersService.getCurrentUserId()).subscribe({
            next: (orders) => {
                this.orders.set(orders);
                this.loading.set(false);
            },
            error: () => {
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
