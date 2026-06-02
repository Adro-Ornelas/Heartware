import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { UsersService } from '@/app/services/users.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];
    private usersService = inject(UsersService); // Inyectamos el servicio

    ngOnInit() {
        this.updateMenu();
    }

    updateMenu() {
        const isAdmin = this.usersService.getUserType() === 'admin';
        const isLoggedIn = this.usersService.isLoggedIn();

        this.model = [
            {
                items: [
                    { label: 'Catálogo', icon: 'pi pi-fw pi-home', routerLink: ['/pages/catalog'] },
                    { label: 'Carrito', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pages/shoppingcart'] },
                    { label: 'Historial', icon: 'pi pi-fw pi-history', routerLink: ['/pages/purchase-history'] },
                    { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/pages/profile'] },
                    
                    // Lógica para ocultar: si no es admin, establecemos visible en false
                    {
                        label: 'Admin Productos',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud/products/'],
                        visible: isAdmin // Se oculta automáticamente si no es admin
                    },
                    {
                        label: 'Admin Usuarios',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/crud/users/'],
                        visible: isAdmin
                    },
                    {
                        label: 'Admin Ordenes',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/crud/orders/'],
                        visible: isAdmin
                    }
                ]
            }
        ];
    }
}