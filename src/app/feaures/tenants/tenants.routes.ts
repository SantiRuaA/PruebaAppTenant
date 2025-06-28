import { Routes } from "@angular/router"
import { TenantListComponent } from "./tenant-list/tenant-list.component"
import { TenantFormComponent } from "./tenant-form/tenant-form.component"

export const TENANTS_ROUTES: Routes = [
  { path: "", component: TenantListComponent },
  { path: "new", component: TenantFormComponent },
  { path: ":id/edit", component: TenantFormComponent },
]