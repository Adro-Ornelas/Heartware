// import { inject, Injectable } from "@angular/core";
// import { ShoppingCartService } from "./shoppingcart.service";

// @Injectable({
//   providedIn: 'root'
// })
// export class PaypalService {
//     // Inyectamos el carrito de compras para poder leer los productos y vaciarlo al finalizar
//     private shoppingCartService = inject(ShoppingCartService);

//     getPayPalConfig(): IPayPalConfig {
//         const currency = 'MXN';

//         return {
//             currency: currency,
//             clientId: 'AWBOrThpKPVJcry7F6Yl3ToVA5uI85PxRLb80rT3d8iyoTzs09lxVNyN06UKBGGHUnWrsePXB6jC9c1N',

//             // Executed when user clicks paypal button
//             createOrderOnClient: (data) => {

//                 const currentCart = this.shoppingCartService.products();
//                 // const currentTotalValue = Number(this.total()).toFixed(2);

//                 // Maps products to PayPal's format
//                 const paypalItems = currentCart.map(item => ({
//                     name: item.name.substring(0, 127), // PayPal has a limit of 127 chars per name
//                     quantity: (item.quantity || 1).toString(), // Take quantity, 1 if null
//                     category: 'PHYSICAL_GOODS',
//                     unit_amount: {
//                         currency_code: currency,
//                         value: Number(item.price).toFixed(2), // Paypals need a float fixed number 2 decimals
//                     },
//                 }));


//                 const exactPaypalTotal = paypalItems.reduce((suma, item) => {
//                     const precioSuelto = Number(item.unit_amount.value);
//                     const cantidad = Number(item.quantity);
//                     return suma + (precioSuelto * cantidad);
//                 }, 0).toFixed(2);

//                 // Return order
//                 return <ICreateOrderRequest>{
//                     intent: 'CAPTURE',
//                     purchase_units: [
//                         {
//                             amount: {
//                                 currency_code: currency,
//                                 value: exactPaypalTotal,
//                                 breakdown: {
//                                     item_total: {
//                                         currency_code: currency,
//                                         value: exactPaypalTotal // La suma de los items DEBE coincidir con el valor total
//                                     }
//                                 }
//                             },
//                             items: paypalItems // Inyectamos los items mapeados aquí
//                         }
//                     ]
//                 };
//             },
//             advanced: {
//                 commit: 'true'
//             },
//             style: {
//                 layout: 'vertical',
//                 color: 'blue', // Opciones: 'gold', 'blue', 'silver', 'black'
//                 shape: 'rect',
//                 label: 'paypal'
//             },
//             onApprove: (data, actions) => {
//                 console.log('onApprove - transaction was approved, but not authorized', data, actions);
//                 actions.order.get().then((details: any) => {
//                     console.log('onApprove - you can get full order details inside onApprove: ', details);
//                 });
//             },
//             onClientAuthorization: (data) => {
//                 console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

//                 // CALL BACKEND, STORE PURCHASE, EMTPY CAR, SHOW SUCCESS MESAGE
//                 // Empty shoppingcart
//                 this.shoppingCartService.empty();
//             },
//             onCancel: (data, actions) => {
//                 console.log('OnCancel', data, actions);
//             },
//             onError: err => {
//                 console.log('OnError', err);
//             },
//             onClick: (data, actions) => {
//                 console.log('onClick', data, actions);
//             },
//         }
//     }
// }