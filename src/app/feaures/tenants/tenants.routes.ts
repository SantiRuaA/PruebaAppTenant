import  { Routes } from "@angular/router"
import { TenantListComponent } from "./tenant-list/tenant-list.component"
import { TenantFormComponent } from "./tenant-form/tenant-form.component"
import { TenantSelectComponent } from "./tenant-select/tenant-select.component"

export const TENANTS_ROUTES: Routes = [
  { path: "", component: TenantListComponent },
  { path: "new", component: TenantFormComponent },
  { path: "select", component: TenantSelectComponent },
  { path: ":id/edit", component: TenantFormComponent },
]