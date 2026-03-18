import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { Profile } from './profile/profile';
import { Shoppingcart } from './shoppingcart/shoppingcart';

export default [
    { path: 'catalog', component: Catalog },
    { path: 'profile', component: Profile },
    { path: 'shoppingcart', component: Shoppingcart },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
