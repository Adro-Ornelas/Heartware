import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@/app/models/product.model';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { Signal } from '@angular/core';
import { NgxPayPalModule } from 'ngx-paypal';
import { OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
    selector: 'app-shoppingcart',
    standalone: true,
    imports: [CurrencyPipe, NgxPayPalModule],
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



    // ------------------NGX-PAYPAL---------------------------

    public payPalConfig?: IPayPalConfig;

    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        this.payPalConfig = {
            currency: 'EUR',
            clientId: 'sb',
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'EUR',
                            value: '9.99',
                            breakdown: {
                                item_total: {
                                    currency_code: 'EUR',
                                    value: '9.99'
                                }
                            }
                        },
                        items: [
                            {
                                name: 'Enterprise Subscription',
                                quantity: '1',
                                category: 'DIGITAL_GOODS',
                                unit_amount: {
                                    currency_code: 'EUR',
                                    value: '9.99',
                                },
                            }
                        ]
                    }
                ]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                layout: 'vertical',
                color: 'gold', // Opciones: 'gold', 'blue', 'silver', 'black'
                shape: 'rect',
                label: 'paypal'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then((details: any) => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });
            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                // this.showSuccess = true;
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
            },
            onError: err => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            },
        };
    }

}