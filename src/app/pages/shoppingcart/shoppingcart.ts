import { AfterViewInit, Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '@/app/models/product.model';
import { ShoppingCartService } from '../../services/shoppingcart.service';
// import { PaypalService } from '@/app/services/paypal.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { PaymentService, CreatePaypalOrderPayload } from '../../services/payment.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-shoppingcart',
    standalone: true,
    imports: [
        CurrencyPipe,
        InputNumberModule,
        // Needed for inputNumber
        FormsModule,
        CommonModule
    ],
    templateUrl: './shoppingcart.html',
    styleUrl: './shoppingcart.scss'
})
export class Shoppingcart implements AfterViewInit {
    loading = signal(false);
    success = signal(false);
    error = signal('');

    private shoppingCartService = inject(ShoppingCartService);
    // private paypalService = inject(PaypalService);



    constructor(private cartService: ShoppingCartService, private paymentService: PaymentService) { }

    public inputNumberValue: any = null;

    cart: Signal<Product[]> = this.shoppingCartService.products;

    total = computed(() => this.shoppingCartService.total());

    // ------------------NGX-PAYPAL---------------------------    

    // Intercepta el cambio y actualiza el signal correctamente
    onQuantityChange(item: Product, newQuantity: number) {
        if (newQuantity !== null && newQuantity > 0) {
            this.shoppingCartService.updateQuantity(item.id, newQuantity);
        }
    }

    removeProduct(id: number) {
        this.shoppingCartService.removeProduct(id);
    }

    empty() {
        this.shoppingCartService.empty();
    }

    exportXML() {
        this.shoppingCartService.exportXML();
    }

    ngOnInit(): void {
        // this.initConfig();
        // this.payPalConfig = this.paypalService.getPayPalConfig();


        if (this.cart.length === 0) {
            this.error.set('El carrito está vacío. Agrega productos antes de pagar.');
            return;
        }
        // this.loadPayPal();
    }

    ngAfterViewInit() {
        this.loadPayPal();
    }

    // private initConfig(): void {
    //     const currency = 'MXN';

    // this.payPalConfig = {
    // currency: currency,
    // clientId: 'AWBOrThpKPVJcry7F6Yl3ToVA5uI85PxRLb80rT3d8iyoTzs09lxVNyN06UKBGGHUnWrsePXB6jC9c1N',
    // // Executed when user clicks paypal button
    // createOrderOnClient: (data) => {

    //     const currentCart = this.cart();
    //     const currentTotalValue = Number(this.total()).toFixed(2);

    //     // Maps products to PayPal's format
    //     const paypalItems = currentCart.map(item => ({
    //         name: item.name.substring(0, 127), // PayPal has a limit of 127 chars per name
    //         quantity: (item.quantity || 1).toString(), // Take quantity, 1 if null
    //         category: 'PHYSICAL_GOODS',
    //         unit_amount: {
    //             currency_code: currency,
    //             value: Number(item.price).toFixed(2), // Paypals need a float fixed number 2 decimals
    //         },
    //     }));

    //     // Return order
    //     return <ICreateOrderRequest>{
    //         intent: 'CAPTURE',
    //         purchase_units: [
    //             {
    //                 amount: {
    //                     currency_code: currency,
    //                     value: currentTotalValue,
    //                     breakdown: {
    //                         item_total: {
    //                             currency_code: currency,
    //                             value: currentTotalValue // La suma de los items DEBE coincidir con el valor total
    //                         }
    //                     }
    //                 },
    //                 items: paypalItems // Inyectamos los items mapeados aquí
    //             }
    //         ]
    //     };
    // },
    // advanced: {
    //     commit: 'true'
    // },
    // style: {
    //     layout: 'vertical',
    //     color: 'blue', // Opciones: 'gold', 'blue', 'silver', 'black'
    //     shape: 'rect',
    //     label: 'paypal'
    // },
    // onApprove: (data, actions) => {
    //     console.log('onApprove - transaction was approved, but not authorized', data, actions);
    //     actions.order.get().then((details: any) => {
    //         console.log('onApprove - you can get full order details inside onApprove: ', details);
    //     });
    // },
    // onClientAuthorization: (data) => {
    //     console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

    //     // CALL BACKEND, STORE PURCHASE, EMTPY CAR, SHOW SUCCESS MESAGE
    //     this.empty();
    // },
    // onCancel: (data, actions) => {
    //     console.log('OnCancel', data, actions);
    // },
    // onError: err => {
    //     console.log('OnError', err);
    // },
    // onClick: (data, actions) => {
    //     console.log('onClick', data, actions);
    // },
    // };
    // }

    // 1. Refactorizamos el constructor del Payload
    private buildOrderPayload(): any {
    const currentCart = this.cart(); 

    // 1. Mapeamos los productos EXACTAMENTE como lo pide la interfaz de tu Backend
    const backendItems = currentCart.map(item => ({
      nombre: item.name.substring(0, 127),
      cantidad: Number(item.quantity || 1),
      precio: Number(item.price)
    }));

    // 2. Calculamos el total exacto basado en estos items para evitar el error de PayPal
    const exactPaypalTotal = backendItems.reduce((suma, item) => {
      return suma + (item.precio * item.cantidad);
    }, 0).toFixed(2);

    // 3. Enviamos al backend la estructura simple que él está esperando
    return {
      total: exactPaypalTotal,
      items: backendItems
    };
  }

    // 2. El resto de tu código se mantiene limpio y manejando errores
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
            // Se eliminó style, pero puedes agregarlo si quieres personalizar el botón
            createOrder: async (_data: any, _actions: any) => {
                this.loading.set(true);
                try {
                    const payload = this.buildOrderPayload(); // Generamos el payload serializado
                    const resp = await lastValueFrom(this.paymentService.createOrder(payload));
                    return resp.id;
                } finally {
                    this.loading.set(false);
                }
            },
            onApprove: async (data: any) => {
                this.loading.set(true);
                try {
                    const capture = await lastValueFrom(this.paymentService.captureOrder(data.orderID));

                    // const customerData = this.cartService.getCustomerData();
                    const paypalData = { orderId: data.orderID, status: (capture as any)?.status || 'COMPLETED' };
                    this.cartService.exportXML();

                    this.cartService.empty();
                    // this.router.navigate(['/']);
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