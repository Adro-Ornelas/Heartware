import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { provideLottieOptions } from 'ngx-lottie';
import { authInterceptor } from './app/core/interceptor/interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes, 
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), 
            withEnabledBlockingInitialNavigation()
        ),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        
        // UNIFICADO: Una sola declaración de HttpClient con fetch e interceptores
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor])
        ),

        provideLottieOptions({
            player: () => import('lottie-web')
        })
    ]
};