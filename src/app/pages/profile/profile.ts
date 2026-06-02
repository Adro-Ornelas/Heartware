import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TagModule } from 'primeng/tag';
import { User, UpdateUserPayload } from '@/app/models/user.model';
import { UsersService } from '@/app/services/users.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, PasswordModule, TagModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss']
})

export class Profile {
    private usersService = inject(UsersService);

    user = signal<User | null>(null);
    loading = signal(false);
    saving = signal(false);
    error = signal('');
    success = signal('');
    editVisible = false;

    form: UpdateUserPayload = {
        name: '',
        last_name: '',
        email: '',
        password: '',
        type: 'user'
    };

    ngOnInit() {
        this.loadUser();
    }

    loadUser() {
        this.loading.set(true);
        this.error.set('');
        this.success.set('');

        this.usersService.getUser(this.usersService.getCurrentUserId()).subscribe({
            next: (user) => {
                this.user.set(user);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('No se encontro el usuario activo. Crea el usuario con id 1 en la base de datos para continuar.');
                this.loading.set(false);
            }
        });
    }

    openEdit() {
        const currentUser = this.user();

        if (!currentUser) {
            return;
        }

        this.form = {
            name: currentUser.name,
            last_name: currentUser.last_name,
            email: currentUser.email,
            password: '',
            type: currentUser.type
        };
        this.error.set('');
        this.success.set('');
        this.editVisible = true;
    }

    saveProfile() {
        const currentUser = this.user();

        if (!currentUser || !this.form.name || !this.form.last_name || !this.form.email) {
            this.error.set('Nombre, apellidos y correo son obligatorios.');
            return;
        }

        const payload: UpdateUserPayload = {
            name: this.form.name.trim(),
            last_name: this.form.last_name.trim(),
            email: this.form.email.trim(),
            type: this.form.type,
            ...(this.form.password ? { password: this.form.password } : {})
        };

        this.saving.set(true);
        this.error.set('');

        this.usersService.updateUser(currentUser.id_user, payload).subscribe({
            next: (user) => {
                this.user.set(user);
                this.success.set('Perfil actualizado correctamente.');
                this.editVisible = false;
                this.saving.set(false);
            },
            error: () => {
                this.error.set('No se pudo actualizar el perfil.');
                this.saving.set(false);
            }
        });
    }
}
