import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { Profile } from './profile/profile';
import { Shoppingcart } from './shoppingcart/shoppingcart';
import { ProductDetail } from './product-detail/product-detail';
import { TermsConditions } from './terms-conditions/terms-conditions';
import { PurchaseHistory } from './purchase-history/purchase-history';

export default [
    { path: 'catalog', component: Catalog },
    { path: 'profile', component: Profile },
    { path: 'shoppingcart', component: Shoppingcart },
    { path: 'purchase-history', component: PurchaseHistory },
    { path: 'product/:id', component: ProductDetail },
    { path: 'terms-conditions', component: TermsConditions},
    { path: '**', redirectTo: '/notfound' },
] as Routes;
