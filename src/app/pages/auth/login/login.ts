import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message'; // Para mostrar errores visuales en PrimeNG
import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';
import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule, ButtonModule, InputTextModule,
        PasswordModule, FormsModule, RouterModule,
        RippleModule, AppFloatingConfigurator, MessageModule
    ],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a Heartware</div>
                            <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                        </div>

                        <form (ngSubmit)="onLogin()">
                            <div class="mb-4" *ngIf="errorMessage()">
                                <p-message severity="error" [text]="errorMessage()"></p-message>
                            </div>

                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo electrónico</label>
                            <input pInputText id="email1" type="email" name="email" placeholder="Dirección de correo" class="w-full md:w-120 mb-6" [(ngModel)]="email" required />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                            <p-password id="password1" name="password" [(ngModel)]="password" placeholder="Contraseña" [toggleMask]="true" styleClass="w-full mb-6" [fluid]="true" [feedback]="false" required></p-password>

                            <p-button type="submit" label="Sign In" styleClass="w-full" [loading]="isLoading()"></p-button>

                            <div class="text-center pt-4">
                                <span class="text-muted-color font-medium">¿No tienes una cuenta? </span>
                                <a routerLink="/auth/signup" class="font-medium no-underline ml-2 text-primary cursor-pointer hover:underline">Regístrate</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    email = '';
    password = '';

    isLoading = signal(false);
    errorMessage = signal('');

    private authService = inject(AuthService);
    private router = inject(Router);

    onLogin() {
        if (!this.email || !this.password) {
            this.errorMessage.set('Por favor, completa todos los campos.');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (res) => {
                console.log(res);
                this.authService.saveToken(res.token);
                this.authService.saveUserId(res.user.id_user);
                // Al estar autenticado, navegamos al catálogo dentro del Shell protegido
                this.router.navigate(['/pages/catalog']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Error al conectar con el servidor.');
            },
            complete: () => this.isLoading.set(false)
        });
    }
}