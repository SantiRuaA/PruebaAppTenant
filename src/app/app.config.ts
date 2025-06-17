import {  APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from "@angular/core"
import { provideRouter, withComponentInputBinding, withViewTransitions } from "@angular/router"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { NgxsModule } from "@ngxs/store"
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin"
import { NgxsRouterPluginModule } from "@ngxs/router-plugin"

import { routes } from "./app.routes"
import { authInterceptor } from "./core/interceptors/auth.interceptor"
import { AuthState } from "./state/auth/auth.state"
import { UserState } from "./state/user/user.state"
import { TenantState } from "./state/tenant/tenant.state"
import { DocumentState } from "./state/document/document.state"
import { environment } from "../enviroments/environment"
import { initializeApplication } from "./core/initializers/app.initializer"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApplication,
      multi: true,
    },
    importProvidersFrom(
      NgxsModule.forRoot([AuthState, UserState, TenantState, DocumentState], {
        developmentMode: !environment.production,
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ["auth.token", "auth.user", "tenant.currentTenantId"],
      }),
      NgxsRouterPluginModule.forRoot()
    ),
  ],
}