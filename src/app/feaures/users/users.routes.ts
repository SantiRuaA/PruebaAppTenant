import  { Routes } from "@angular/router"
import { UserListComponent } from "./user-list/user-list.component"
import { UserDetailComponent } from "./user-detail/user-detail.component"
import { UserFormComponent } from "./user-form/user-form.component"

export const USERS_ROUTES: Routes = [
  { path: "", component: UserListComponent },
  { path: "new", component: UserFormComponent },
  { path: ":id", component: UserDetailComponent },
  { path: ":id/edit", component: UserFormComponent },
]
