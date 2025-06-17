import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup
  token = ""
  loading = false
  submitted = false
  success = false
  error = ""

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams["token"] || ""

    if (!this.token) {
      this.error = "Contraseña incorrecta"
      return
    }

    this.resetPasswordForm = this.formBuilder.group(
      {
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
    this.submitted = true

    if (this.resetPasswordForm.invalid) {
      return
    }

    this.loading = true
    this.error = ""

    const { password } = this.resetPasswordForm.value

    this.authService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.success = true
        this.loading = false

        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(["/auth/login"])
        }, 3000)
      },
      error: (error) => {
        this.error = error.message || "Ocurrio un error"
        this.loading = false
      },
    })
  }
}