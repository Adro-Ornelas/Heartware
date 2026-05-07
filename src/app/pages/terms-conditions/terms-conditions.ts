import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-terms-conditions',
    templateUrl: './terms-conditions.html',
    styleUrl: './terms-conditions.scss',
    standalone: true,
    imports: [CardModule, ScrollPanelModule, DividerModule,
        ButtonModule, SelectButtonModule, FormsModule, RouterLink],
})
export class TermsConditions {
    // Opciones del selector
    stateOptions: any[] = [
        { label: 'Términos y Condiciones', value: 'terms' },
        { label: 'Aviso de Privacidad', value: 'privacy' }
    ];

    // Valor por defecto
    selectedView: string = 'terms';

    lastUpdate = '06 de Mayo, 2026';
}
