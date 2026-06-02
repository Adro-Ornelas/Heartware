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
    templateUrl: './signup.html',
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