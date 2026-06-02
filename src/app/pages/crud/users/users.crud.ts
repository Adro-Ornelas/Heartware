import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasswordModule } from 'primeng/password'; 

// Importa tus modelos y servicio
import { User, UpdateUserPayload } from '@/app/models/user.model';
import { UsersService } from '@/app/services/users.service';

@Component({
    selector: 'app-crud-users',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        SelectModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        PasswordModule
    ],
    templateUrl: './users.crud.html',
    providers: [MessageService, UsersService, ConfirmationService]
})
export class CrudUsers implements OnInit {
    userDialog: boolean = false;
    users = signal<User[]>([]);
    
    // Extendemos Partial<User> para que el formulario acepte el password temporalmente
    user: Partial<User> & { password?: string } = {}; 
    selectedUsers!: User[] | null;
    submitted: boolean = false;
    
    userTypes!: any[];

    @ViewChild('dt') dt!: Table;

    constructor(
        private userService: UsersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.userService.getUsers().subscribe({
            next: (data) => this.users.set(data),
            error: () => this.showToast('error', 'Error', 'No se pudieron cargar los usuarios')
        });

        // Tipos definidos explícitamente en tu modelo
        this.userTypes = [
            { label: 'Administrador', value: 'admin' },
            { label: 'Usuario Estándar', value: 'user' }
        ];
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.user = { type: 'user' }; // Valor por defecto seguro
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: User) {
        this.user = { ...user, password: '' }; // Limpiamos la contraseña por seguridad
        this.userDialog = true;
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;

        if (this.user.name?.trim() && this.user.last_name?.trim() && this.user.email?.trim()) {
            let _users = [...this.users()];

            // Preparamos el payload basado en tu UpdateUserPayload
            const payload: UpdateUserPayload = {
                name: this.user.name!,
                last_name: this.user.last_name!,
                email: this.user.email!,
                type: this.user.type as 'admin' | 'user'
            };

            // Solo enviamos el password si el usuario escribió algo
            if (this.user.password && this.user.password.trim() !== '') {
                payload.password = this.user.password;
            }

            if (this.user.id_user) {
                // Actualizar
                this.userService.updateUser(this.user.id_user, payload).subscribe({
                    next: (updatedUser) => {
                        const index = _users.findIndex(u => u.id_user === this.user.id_user);
                        if (index !== -1) {
                            _users[index] = updatedUser;
                            this.users.set(_users);
                        }
                        this.showToast('success', 'Éxito', 'Usuario Actualizado');
                    },
                    error: () => this.showToast('error', 'Error', 'No se pudo actualizar')
                });
            } else {
                // Crear
                this.userService.createUser(payload).subscribe({
                    next: (newUser) => {
                        this.users.set([..._users, newUser]);
                        this.showToast('success', 'Éxito', 'Usuario Creado');
                    },
                    error: () => this.showToast('error', 'Error', 'No se pudo crear')
                });
            }

            this.userDialog = false;
            this.user = {};
        }
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar a ${user.name} ${user.last_name}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.userService.deleteUser(user.id_user).subscribe({
                    next: () => {
                        this.users.set(this.users().filter((val) => val.id_user !== user.id_user));
                        this.user = {};
                        this.showToast('success', 'Completado', 'Usuario Eliminado');
                    },
                    error: () => this.showToast('error', 'Error', 'No se pudo eliminar')
                });
            }
        });
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que deseas eliminar los usuarios seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.showToast('success', 'Completado', 'Usuarios Eliminados locales');
            }
        });
    }

    private showToast(severity: string, summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail, life: 3000 });
    }
}