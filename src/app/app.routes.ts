import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { roleGuard } from "./core/guards/role.guard";
import { chatGuard } from "./core/guards/chat.guard";
import { LayoutComponent } from "./core/components/layout/layout.component";

export const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "auth", loadChildren: () => import("./auth/auth.routes").then((m) => m.AUTH_ROUTES) },

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
        path: "chats",
        canActivate: [chatGuard],
        loadChildren: () => import("./feaures/chats/chats.routes").then((m) => m.CHAT_ROUTES),
      },
      {
        path: "admin",
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadChildren: () => import("./feaures/admin/admin.routes").then((m) => m.ADMIN_ROUTES),
      }
    ],
  },

  { path: "**", redirectTo: "dashboard" },
];