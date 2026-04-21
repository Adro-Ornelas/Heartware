import { Component, computed, inject, Signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@/app/models/product.model';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { PaypalService } from '@/app/services/paypal.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-shoppingcart',
    standalone: true,
    imports: [
        CurrencyPipe,
        NgxPayPalModule,
        InputNumberModule,
        // Needed for inputNumber
        FormsModule
    ],
    templateUrl: './shoppingcart.html',
    styleUrl: './shoppingcart.scss'
})
export class Shoppingcart {
    private shoppingCartService = inject(ShoppingCartService);
    private paypalService = inject(PaypalService);

    public inputNumberValue: any = null;

    cart: Signal<Product[]> = this.shoppingCartService.products;

    total = computed(() => this.shoppingCartService.total());

    // ------------------NGX-PAYPAL---------------------------
    public payPalConfig?: IPayPalConfig;

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
        this.payPalConfig = this.paypalService.getPayPalConfig();
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

}