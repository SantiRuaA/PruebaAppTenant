import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import  { Store } from "@ngxs/store"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from "@angular/forms"
import  { Observable } from "rxjs"
import { take, filter } from 'rxjs/operators'; 
import { LoadUser, CreateUser, UpdateUser } from "../../../state/user/user.actions"
import { UserState } from "../../../state/user/user.state"
import { TenantState } from "../../../state/tenant/tenant.state"
import { User } from "../../../shared/models/user.model"

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: "./user-form.component.html",
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup
  isEditMode = false
  userId: number | null = null
  loading$: Observable<boolean>
  error$: Observable<string | null>

  roles = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "user", label: "User" },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loading$ = this.store.select(UserState.loading)
    this.error$ = this.store.select(UserState.error)
  }

  ngOnInit(): void {
    this.initForm()

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.userId = Number(id)
      this.loadUser(Number(id))
    }
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      username: ["", [Validators.required]],
      role: ["user", [Validators.required]],
      phone: [""],
      address: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        zipCode: [""],
        country: [""],
      }),
    })

    // Add password fields only for new users
    if (!this.isEditMode) {
      this.userForm.addControl("password", this.formBuilder.control("", [Validators.required, Validators.minLength(6)]))
      this.userForm.addControl(
        "confirmPassword",
        this.formBuilder.control("", [Validators.required, this.passwordMatchValidator.bind(this)]),
      )
    }
  }

  passwordMatchValidator(control: any): { [key: string]: boolean } | null {
    if (!this.userForm) {
      return null
    }
    const password = this.userForm.get("password")?.value
    const confirmPassword = control.value
    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  loadUser(id: number): void {
    const currentTenantId = this.store.selectSnapshot(TenantState.currentTenantId);
    if (currentTenantId) {
      this.store.dispatch(new LoadUser(id)); // Despachamos la acción

      // Reaccionamos al cambio en el estado para rellenar el formulario
      this.store.select(UserState.selectedUser).pipe(
        // take(1) asegura que la suscripción se cierre automáticamente después de recibir el primer valor no nulo.
        filter(user => user !== null && user.id === id),
        take(1)
      ).subscribe(user => {
        if (user) {
          this.userForm.patchValue(user); // Rellenamos el formulario
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant);
    if (!currentTenant) {
      return;
    }

    const formData = this.userForm.value;

    if (this.isEditMode && this.userId) {
      const userData: Partial<User> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        roles: [formData.role], 

      };

      this.store.dispatch(new UpdateUser(this.userId, currentTenant.id, userData))
        .subscribe({
          next: () => {
            this.router.navigate(["/users", this.userId]);
          },
        });
    } else {
      const userData: Partial<User> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        roles: [formData.role],
        tenantIds: [currentTenant.id],
      };

      this.store.dispatch(new CreateUser(userData, formData.password))
        .subscribe({
          next: () => {
            this.router.navigate(["/users"]);
          },
        });
    }
  }
}