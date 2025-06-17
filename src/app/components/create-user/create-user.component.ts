import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Store, Select } from "@ngxs/store";
import { UserState } from '../../state/user/user.state'; 
import { CreateUser } from '../../state/user/user.actions'; 
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: "app-create-user",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./create-user.component.html",
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;
  @Select(UserState.loading) loading$!: Observable<boolean>;
  @Select(UserState.error) error$!: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: ["user", [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    // Despachamos la acción para crear un usuario a través del UserState
    this.store.dispatch(new CreateUser(this.userForm.value));
  }
}


