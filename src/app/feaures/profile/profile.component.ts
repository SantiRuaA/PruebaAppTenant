import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { Store } from "@ngxs/store"
import { ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import  { Observable } from "rxjs"
import { UpdateUserProfile } from "../../state/auth/auth.actions"
import { AuthState } from "../../state/auth/auth.state"
import  { User } from "../../shared/models/user.model"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup
  passwordForm!: FormGroup
  user$: Observable<User | null>
  loading$: Observable<boolean>
  error$: Observable<string | null>

  profileUpdateSuccess = false
  passwordUpdateSuccess = false

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.user$ = this.store.select(AuthState.user)
    this.loading$ = this.store.select(AuthState.loading)
    this.error$ = this.store.select(AuthState.error)
  }

  ngOnInit(): void {
    this.initForms()

    this.user$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        })
      }
    })
  }

  initForms(): void {
    this.profileForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      username: ["", [Validators.required]],
    })

    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get("newPassword")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (newPassword !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return
    }

    const formData = this.profileForm.value

    this.store
      .dispatch(
        new UpdateUserProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
        }),
      )
      .subscribe({
        next: () => {
          this.profileUpdateSuccess = true
          setTimeout(() => {
            this.profileUpdateSuccess = false
          }, 3000)
        },
      })
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      return
    }

    // En una app real hay que hacer peticion a la api para cambiar la contraseña
    // Para la prueba se pone un mensaje exitoso
    this.passwordUpdateSuccess = true
    setTimeout(() => {
      this.passwordUpdateSuccess = false
      this.passwordForm.reset()
    }, 3000)
  }
}