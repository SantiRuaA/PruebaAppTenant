import  { Routes } from "@angular/router"
import { LoginComponent } from "./components/login/login.component"
import { RegisterComponent } from "./components/register/register.component"
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component"
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component"

export const AUTH_ROUTES: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
]