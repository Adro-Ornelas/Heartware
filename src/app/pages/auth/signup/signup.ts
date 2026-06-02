import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';
import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule, ButtonModule, InputTextModule, 
        PasswordModule, FormsModule, RouterModule, 
        RippleModule, AppFloatingConfigurator, MessageModule,
        DialogModule
    ],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden py-8">
            <div class="flex flex-col items-center justify-center w-full max-w-xl">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)" class="w-full">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-20" style="border-radius: 53px">
                        
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Crea tu cuenta</div>
                            <span class="text-muted-color font-medium">Regístrate en Heartware para empezar</span>
                        </div>

                        <form (ngSubmit)="onSignup()">
                            <div class="mb-4" *ngIf="errorMessage()">
                                <p-message severity="error" [text]="errorMessage()"></p-message>
                            </div>

                            <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nombre</label>
                            <input pInputText id="name" type="text" name="name" placeholder="Tu nombre" class="w-full mb-6" [(ngModel)]="name" required />

                            <label for="last_name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Apellido</label>
                            <input pInputText id="last_name" type="text" name="lastName" placeholder="Tu apellido" class="w-full mb-6" [(ngModel)]="lastName" required />

                            <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo electrónico</label>
                            <input pInputText id="email" type="email" name="email" placeholder="Dirección de correo" class="w-full mb-6" [(ngModel)]="email" required />

                            <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                            <p-password id="password" name="password" [(ngModel)]="password" placeholder="Contraseña" [toggleMask]="true" styleClass="w-full mb-6" [fluid]="true" [feedback]="true" promptLabel="Elige una contraseña" weakLabel="Débil" mediumLabel="Media" strongLabel="Fuerte" required></p-password>

                            <p-button type="submit" label="Registrarse" styleClass="w-full mb-6" [loading]="isLoading()"></p-button>

                            <div class="text-center">
                                <span class="text-muted-color font-medium">¿Ya tienes una cuenta? </span>
                                <a routerLink="/auth/login" class="font-medium no-underline ml-2 text-primary cursor-pointer hover:underline">Inicia Sesión</a>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>

    <p-dialog [(visible)]="displaySuccessDialog" [modal]="true" [closable]="false" [draggable]="false" [style]="{ width: '25rem' }">
    <div class="flex flex-col items-center justify-center p-6 text-center gap-4">
        <i class="pi pi-check-circle text-green-500" style="font-size: 5rem;"></i>

        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">¡Registro exitoso!</h2>
        <p class="text-surface-500 dark:text-surface-400 m-0">
            Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión en Heartware.
        </p>

        <p-button label="Ir al Login" severity="success" styleClass="mt-4 w-full" (onClick)="goToLogin()"></p-button>
    </div>
</p-dialog>
    `
})
export class Signup {
    name = '';
    lastName = '';
    email = '';
    password = '';
    
    isLoading = signal(false);
    errorMessage = signal('');
    displaySuccessDialog = signal(false);

    private authService = inject(AuthService);
    private router = inject(Router);

   onSignup() {
        if (!this.name || !this.lastName || !this.email || !this.password) {
            this.errorMessage.set('Por favor, completa todos los campos.');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        const signupData = {
            name: this.name,
            last_name: this.lastName,
            email: this.email,
            password: this.password
        };

        this.authService.signup(signupData).subscribe({
            next: (res) => {
                // En lugar de redirigir de inmediato, mostramos el diálogo
                this.displaySuccessDialog.set(true);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Error al conectar con el servidor.');
            },
            complete: () => this.isLoading.set(false)
        });
    }

    // Método que se ejecuta cuando el usuario hace clic en el botón del diálogo
    goToLogin() {
        this.displaySuccessDialog.set(false);
        this.router.navigate(['/auth/login']);
    }
}