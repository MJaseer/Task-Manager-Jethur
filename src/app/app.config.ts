// import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes)
//   ]
// };

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Enable Zoneless Change Detection
    provideZonelessChangeDetection(),
    
    // 2. HTTP Client
    provideHttpClient(),
    
    // 3. Animations (Required for many PrimeNG components)
    provideAnimationsAsync(),
    
    // 4. PrimeNG Setup with CSS Layering
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                // cssLayer: {
                //     name: 'primeng',
                //     order: 'tailwind-base, primeng, tailwind-utilities'
                // }
            }
        }
    }),

    // 5. Router
    provideRouter(routes, withComponentInputBinding())
  ]
};