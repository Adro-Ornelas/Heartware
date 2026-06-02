import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Catalog } from './app/pages/catalog/catalog';
import { Notfound } from './app/notfound/notfound';
import { authGuard } from './app/core/guard/guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // { path: 'pages/catalog', component: Catalog },
            { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
        ]
    },

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: 'notfound' },


    // {
    //     path: 'login', loadComponent: () =>
    //         import('./app/pages/auth/login/login').then(m => m.Login),
    // },

    // {
    //     path: 'signup', loadComponent: () =>
    //         import('./app/pages/auth/signup/signup').then(m => m.SignUp),
    // },
    // {
    //     path: 'perfil',
    //     canActivate: [authGuard],
    //     // loadComponent: () => import('./pages/history/history').then(m => m.Hstory),
    // }
];