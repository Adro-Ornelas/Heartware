import { AfterViewInit, Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '@/app/models/product.model';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { PaymentService, CreatePaypalOrderPayload } from '../../services/payment.service';
import { lastValueFrom } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { OrdersService } from '@/app/services/orders.service';
import { ProductService } from '@/app/services/products.service'; // <--- Para consultar el stock real
import { MessageService } from 'primeng/api'; // <--- Para controlar los Toasts
import { ToastModule } from 'primeng/toast'; // <--- Módulo del Toast

@Component({
    selector: 'app-shoppingcart',
    standalone: true,
    imports: [
        CurrencyPipe,
        InputNumberModule,
        FormsModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        ToastModule // <--- Agregado a los imports del componente standalone
    ],
    templateUrl: './shoppingcart.html',
    styleUrl: './shoppingcart.scss',
    providers: [MessageService] // <--- Proveedor local requerido por PrimeNG para los Toasts
})
export class Shoppingcart implements OnInit, AfterViewInit {
    loading = signal(false);
    success = signal(false);
    error = signal('');

    private shoppingCartService = inject(ShoppingCartService);
    private productService = inject(ProductService); // <--- Inyectado
    private messageService = inject(MessageService); // <--- Inyectado

    displaySuccessDialog: boolean = false;
    public inputNumberValue: any = null;

    // Arreglo local para almacenar temporalmente las existencias reales del backend
    private productosInventario: Product[] = [];

    cart: Signal<Product[]> = this.shoppingCartService.products;
    total = computed(() => this.shoppingCartService.total());

    constructor(private cartService: ShoppingCartService, private paymentService: PaymentService, private ordersService: OrdersService) { }

    ngOnInit(): void {
        // Cargar el stock real desde la base de datos al inicializar la vista
        this.productService.getProducts().subscribe({
            next: (data) => {
                this.productosInventario = data;
            },
            error: (err) => console.error('Error cargando inventario de validación: ', err)
        });

        // Corrección del Signal: se invoca como función () para leer su length correctamente
        if (this.cart().length === 0) {
            this.error.set('El carrito está vacío. Agrega productos antes de pagar.');
            return;
        }
    }

    ngAfterViewInit() {
        this.loadPayPal();
    }
    onQuantityChange(item: Product, newQuantity: number) {
        if (newQuantity !== null && newQuantity > 0) {
            const productoOriginal = this.productosInventario.find(p => p.id === item.id);
            const stockMaximo = productoOriginal ? productoOriginal.quantity : Infinity;

            if (newQuantity >= stockMaximo) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Stock máximo superado',
                    detail: `Solo quedan ${stockMaximo} unidades disponibles de ${item.name}.`
                });
                this.shoppingCartService.updateQuantity(item.id, stockMaximo);
            } else {
                this.shoppingCartService.updateQuantity(item.id, newQuantity);
            }
        }
    }
    getMaxStock(productId: number): number {
        const productoOriginal = this.productosInventario.find(p => p.id === productId);
        return productoOriginal ? productoOriginal.quantity : Infinity;
    }

    removeProduct(id: number) {
        this.shoppingCartService.removeProduct(id);
    }

    empty() {
        this.shoppingCartService.empty();
    }

    private buildOrderPayload(): any {
        const currentCart = this.cart();

        const backendItems = currentCart.map(item => ({
            nombre: item.name.substring(0, 127),
            cantidad: Number(item.quantity || 1),
            precio: Number(item.price)
        }));

        const exactPaypalTotal = backendItems.reduce((suma, item) => {
            return suma + (item.precio * item.cantidad);
        }, 0).toFixed(2);

        return {
            total: exactPaypalTotal,
            items: backendItems
        };
    }

    private async loadPayPal() {
        try {
            const { clientId } = await lastValueFrom(this.paymentService.getClientId());

            if (!clientId || clientId.toString().toLowerCase().includes('your_paypal') || clientId === 'undefined') {
                this.error.set('ClientId de PayPal no configurado en backend/.env. Añade PAYPAL_CLIENT_ID (sandbox) y reinicia el servidor.');
                return;
            }

            if (!(window as any).paypal) {
                await this.appendPayPalScript(clientId);
            }

            this.renderButtons();
        } catch (err: any) {
            if (err instanceof Event) {
                const ev = err as Event;
                this.error.set(`No se pudo cargar PayPal: fallo de red o bloqueo al cargar ${ev.type}. Revisa conexión o CSP.`);
            } else if (err && err.message) {
                this.error.set('No se pudo cargar PayPal: ' + err.message);
            } else {
                this.error.set('No se pudo cargar PayPal: ' + String(err));
            }
        }
    }

    private appendPayPalScript(clientId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=MXN`;
            script.onload = () => resolve();
            script.onerror = (e) => {
                const msg = `Error loading PayPal SDK from ${script.src}`;
                const error = new Error(msg);
                try { (error as any).event = e; } catch { }
                reject(error);
            };
            document.body.appendChild(script);
        });
    }

    private renderButtons() {
        const paypal = (window as any).paypal;
        if (!paypal || !paypal.Buttons) {
            this.error.set('SDK de PayPal no disponible');
            return;
        }

        paypal.Buttons({
            createOrder: async (_data: any, _actions: any) => {
                this.loading.set(true);
                try {
                    const payload = this.buildOrderPayload();
                    const resp = await lastValueFrom(this.paymentService.createOrder(payload));
                    return resp.id;
                } finally {
                    this.loading.set(false);
                }
            },
            onApprove: async (data: any) => {
                this.loading.set(true);
                try {
                    const purchasedItems = this.cart();
                    const total = this.total();
                    const capture = await lastValueFrom(this.paymentService.captureOrder(data.orderID));

                    const shippingInfo = capture.purchase_units[0].shipping;
                    const customerData = {
                        nombre: shippingInfo?.name?.full_name ?? '',
                        calle: shippingInfo?.address?.address_line_1 ?? '',
                        ciudad: shippingInfo?.address?.admin_area_2 ?? '',
                        estado: shippingInfo?.address?.admin_area_1 ?? '',
                        codigoPostal: shippingInfo?.address?.postal_code ?? '',
                        pais: shippingInfo?.address?.country_code ?? ''
                    };

                    const paypalData = {
                        orderId: data.orderID,
                        status: capture.status || 'COMPLETED'
                    };

                    const idUser = this.ordersService.getCurrentUserId();

                    if (!idUser) {
                        this.error.set('Debes iniciar sesión para realizar una compra.');
                        return;
                    }
                    await lastValueFrom(this.ordersService.createOrder({
                        id_user: idUser,
                        payment_method: 'Digital wallet',
                        paypal_status: paypalData.status,
                        customer_name: customerData.nombre,
                        street: customerData.calle,
                        city: customerData.ciudad,
                        state_address: customerData.estado,
                        postal_code: customerData.codigoPostal,
                        country: customerData.pais,
                        price: total,
                        products: purchasedItems.map(item => ({
                            id_product: item.id,
                            quantity: Number(item.quantity || 1)
                        }))
                    }));

                    this.cartService.exportXML(customerData, paypalData);
                    this.displaySuccessDialog = true;
                    this.cartService.empty();

                } catch (err: any) {
                    this.error.set('Error capturando pago: ' + (err?.message || err));
                } finally {
                    this.loading.set(false);
                }
            },
            onError: (err: any) => {
                this.error.set('Error PayPal: ' + JSON.stringify(err));
            },
        }).render('#paypal-button-container');
    }
}