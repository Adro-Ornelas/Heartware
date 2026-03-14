import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
 
import { Catalog } from './catalog/catalog';
import { Profile } from './profile/profile';
import { Shoppingcart } from './shoppingcart/shoppingcart';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'catalog', component: Catalog },
    { path: 'profile', component: Profile },
    { path: 'shoppingcart', component: Shoppingcart },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
