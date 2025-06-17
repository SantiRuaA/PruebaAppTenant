import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { AuthService } from "../../core/services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  errorMessage = ""
  loading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.errorMessage = ""

    const { username, password } = this.loginForm.value

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading = false
      },
      error: (error) => {
        this.errorMessage = error.message
        this.loading = false
      },
    })
  }
}