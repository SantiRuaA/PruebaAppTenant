import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { roleGuard } from "./core/guards/role.guard";
import { chatGuard } from "./core/guards/chat.guard";
import { LayoutComponent } from "./core/components/layout/layout.component";
import { ChatFormComponent } from "./feaures/chats/chat-form/chat-form.component";

export const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "auth", loadChildren: () => import("./auth/auth.routes").then((m) => m.AUTH_ROUTES) },
  

  // El Layout principal que protege las páginas de usuario y admin
  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "dashboard",
        canActivate: [chatGuard],
        loadComponent: () => import("./feaures/dashboard/dashboard.component").then((m) => m.DashboardComponent),
      },
      {
        path: "profile",
        loadComponent: () => import("./feaures/profile/profile.component").then(m => m.ProfileComponent)
      },
      {
        // La sección principal del usuario para ver sus conversaciones
        path: "chats",
        canActivate: [chatGuard],
        loadChildren: () => import("./feaures/chats/chats.routes").then((m) => m.CHAT_ROUTES),
      },
      {
        // La nueva sección de administración, protegida por el rol de admin
        path: "admin",
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadChildren: () => import("./feaures/admin/admin.routes").then((m) => m.ADMIN_ROUTES),
      }
    ],
  },

  { path: "**", redirectTo: "dashboard" },
];