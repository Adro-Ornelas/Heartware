import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { Profile } from './profile/profile';
import { Shoppingcart } from './shoppingcart/shoppingcart';
import { ProductDetail } from './product-detail/product-detail';

export default [
    { path: 'catalog', component: Catalog },
    { path: 'profile', component: Profile },
    { path: 'shoppingcart', component: Shoppingcart },
    { path: 'product/:id', component: ProductDetail },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
