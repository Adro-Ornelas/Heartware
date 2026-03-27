import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <a href="https://github.com/Adro-Ornelas/Heartware" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Heartware
        </a>
                    
        <img src="images/favicon.webp" alt="Heartware logo" style="height: 40px;margin-left: 20px;" />

    </div>`
})
export class AppFooter {}
