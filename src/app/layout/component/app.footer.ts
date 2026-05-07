import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [RouterLink],
    template: `
    <div class="layout-footer">
        <img src="images/favicon.webp" alt="Heartware logo" style="height: 30px;" />
        <span class="font-bold text-lg text-primary">Heartware</span>
        <div class="flex align-items-center gap-3">
        <span class="text-lg text-600">© {{ currentYear }} All rights reserved.</span>

        
        <a routerLink="/pages/terms-conditions"
            class="text-primary hover:underline text-lg">
            <span>Términos y condiciones | </span>

            <span>Aviso de privacidad</span>
        </a>
        
    </div>
    </div>
  `
})



export class AppFooter {
    currentYear = new Date().getFullYear();
}