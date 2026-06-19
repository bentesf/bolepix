import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideZoneChangeDetection } from "@angular/core";

import { routes } from "./app.routes";

import { PoI18nModule, PoHttpInterceptorModule, PoHttpRequestModule, PoTabsModule } from "@po-ui/ng-components";
import { ProtheusLibCoreModule } from "@totvs/protheus-lib-core";
export const appConfig: ApplicationConfig = {
  providers: [
  provideRouter(routes),
  provideHttpClient(withInterceptorsFromDi()),
  importProvidersFrom([
                        ProtheusLibCoreModule,
                        PoHttpRequestModule,
                        PoHttpInterceptorModule,
                        PoI18nModule,
                        PoTabsModule 
  ]),
  provideZoneChangeDetection({ eventCoalescing: true }),
  { provide: "Window", useValue: window },
]};