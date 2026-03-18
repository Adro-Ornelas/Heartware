import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Catalog } from './app/pages/catalog/catalog';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Catalog },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];