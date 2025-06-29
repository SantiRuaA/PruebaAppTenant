import { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"
import { roleGuard } from "./core/guards/role.guard"
import { chatGuard } from "./core/guards/chat.guard"
import { LayoutComponent } from "./core/components/layout/layout.component"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard, chatGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("./feaures/dashboard/dashboard.routes").then((m) => m.DASHBOARD_ROUTES),
        canActivate: [authGuard, chatGuard],
      },
      {
        path: "documents",
        loadChildren: () => import("./feaures/messages/message.routes").then((m) => m.DOCUMENTS_ROUTES),
        canActivate: [authGuard, chatGuard],
      },
      {
        path: "users",
        loadChildren: () => import("./feaures/users/users.routes").then((m) => m.USERS_ROUTES),
        canActivate: [authGuard, roleGuard],
        data: { roles: ["admin"] },
      },
      {
        path: "profile",
        loadChildren: () => import("./feaures/profile/profile.routes").then((m) => m.PROFILE_ROUTES),
        canActivate: [authGuard],
      },
      {
        path: "chats",
        loadChildren: () => import("./feaures/chats/chats.routes").then((m) => m.TENANTS_ROUTES),
        canActivate: [authGuard, roleGuard],
        data: { roles: ["admin"] },
      },
    ],
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
]