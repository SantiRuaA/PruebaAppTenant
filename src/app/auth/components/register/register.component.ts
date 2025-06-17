import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Store } from "@ngxs/store"
import { CommonModule } from "@angular/common"
import { Observable } from "rxjs"
import { Register } from "../../../state/auth/auth.actions"
import { AuthState } from "../../../state/auth/auth.state"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  loading$: Observable<boolean>
  error$: Observable<string | null>

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.loading$ = this.store.select(AuthState.loading)
    this.error$ = this.store.select(AuthState.error)
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        username: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (password !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return
    }

    const { firstName, lastName, username, email, password } = this.registerForm.value

    this.store.dispatch(
      new Register({
        firstName,
        lastName,
        username,
        email,
        roles: ["user"],
        tenantIds: [1], // Tenant por defecto
      }),
    )
  }
}
