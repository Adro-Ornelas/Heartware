import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/notfound/notfound';
import { authGuard } from './app/core/guard/guard';

export const appRoutes: Routes = [
    //  Rutas de la Aplicación Protegidas por el Cascarón (Layout)
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard], // El Guard protege todo el Layout y sus páginas hijas
        children: [
            { path: '', redirectTo: 'pages/catalog', pathMatch: 'full' }, // Si está logueado va al catálogo
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
        ]
    },

    //  Rutas Públicas (Fuera del Layout de la App)
    {
        path: 'auth',
        loadChildren: () => import('./app/pages/auth/auth.routes')
    },

    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: 'notfound' },
];