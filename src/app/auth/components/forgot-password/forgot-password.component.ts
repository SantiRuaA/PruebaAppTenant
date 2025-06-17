import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../../core/services/auth.service"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./forgot-password.component.html",
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup
  loading = false
  submitted = false
  success = false
  error = ""

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    })
  }

  onSubmit(): void {
    this.submitted = true

    if (this.forgotPasswordForm.invalid) {
      return
    }

    this.loading = true
    this.error = ""
    this.success = false

    const { email } = this.forgotPasswordForm.value

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.success = true
        this.loading = false
      },
      error: (error) => {
        this.error = error.message || "Ocurrio un error"
        this.loading = false
      },
    })
  }
}