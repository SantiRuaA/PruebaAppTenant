import { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"
import { roleGuard } from "./core/guards/role.guard"
import { tenantGuard } from "./core/guards/tenant.guard"
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
    canActivate: [authGuard, tenantGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("./feaures/dashboard/dashboard.routes").then((m) => m.DASHBOARD_ROUTES),
        canActivate: [authGuard, tenantGuard],
      },
      {
        path: "documents",
        loadChildren: () => import("./feaures/documents/document.routes").then((m) => m.DOCUMENTS_ROUTES),
        canActivate: [authGuard, tenantGuard],
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
        path: "tenants",
        loadChildren: () => import("./feaures/tenants/tenants.routes").then((m) => m.TENANTS_ROUTES),
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