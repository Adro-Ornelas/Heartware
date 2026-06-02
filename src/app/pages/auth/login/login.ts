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
    templateUrl: './login.html',
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
                this.authService.saveUserType(res.user.type); // Guardamos el rol del usuario
                
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