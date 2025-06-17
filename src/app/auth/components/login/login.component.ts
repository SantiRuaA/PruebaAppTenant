import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import {  RouterLink } from "@angular/router"
import  { Store } from "@ngxs/store"
import { Login } from "../../../state/auth/auth.actions"
import { AlertComponent } from "../../../shared/components/alert/alert.component"
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component"
import { Observable } from "rxjs"
import { AuthState } from "../../../state/auth/auth.state"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent, LoadingSpinnerComponent],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  loginForm: FormGroup
  loading$: Observable<boolean>
  error$: Observable<string | null>

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.loading$ = this.store.select(AuthState.loading)
    this.error$ = this.store.select(AuthState.error)
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    })

  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.store.dispatch(new Login(
      this.loginForm.value.username,
      this.loginForm.value.password
    ));
  }
}