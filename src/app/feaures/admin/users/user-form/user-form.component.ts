import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../../../../shared/models/user.model';

import { UserState } from '../../../../state/user/user.state';
import { CreateUser, UpdateUser, LoadUser } from '../../../../state/user/user.actions';

import { ChatState } from '../../../../state/chat/chat.state';
import { LoadChats } from '../../../../state/chat/chat.actions';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId: number | null = null;

  // Observables para el estado de carga y errores
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  // Lista de roles disponibles para mostrar en el formulario
  availableRoles = ['admin', 'user'];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicializamos los observables desde el store
    this.loading$ = this.store.select(UserState.loading);
    this.error$ = this.store.select(UserState.error);
  }

  // Helpers para acceder fácilmente a los FormArrays desde el template
  get rolesFormArray() {
    return this.userForm.get('roles') as FormArray;
  }

  get chatsFormArray() {
    return this.userForm.get('chatIds') as FormArray;
  }

  ngOnInit(): void {
    // Al iniciar, pedimos la lista de todos lo chats para poder mostrarlos
    this.store.dispatch(new LoadChats());
    this.initializeForm();

    // Verificamos si estamos en modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = +idParam;
      this.store.dispatch(new LoadUser(this.userId));

      // Cuando el usuario a editar se cargue en el estado, poblamos el formulario
      this.store.select(UserState.selectedUser).pipe(
        tap(user => {
          if (user && user.id === this.userId) {
            this.populateFormWithUserData(user);
          }
        })
      ).subscribe();
    } else {
      // Si estamos en modo CREACIÓN, poblamos los checkboxes vacíos
      this.populateFormWithUserData(null);
    }
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      // Creamos los FormArrays vacíos. Se llenarán dinámicamente.
      roles: this.fb.array([]),
      chatIds: this.fb.array([]),
      phone: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: [''],
      }),
      password: [''],
      confirmPassword: ['']
    });

    if (!this.isEditMode) {
      // ...hacemos que los campos de contraseña sean obligatorios.
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);

      // Y añadimos el validador que compara ambas contraseñas al GRUPO completo.
      this.userForm.setValidators(this.passwordMatchValidator);
    }
  }

  passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    // El 'control' que llega aquí cuando se usa en setValidators es el FormGroup completo.
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Si los controles aún no existen (como en modo edición), no hacemos nada.
    if (!password && !confirmPassword) {
      return null;
    }

    // Devolvemos el error si no coinciden.
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  populateFormWithUserData(user: User | null): void {
    // Rellenamos los campos de texto si el usuario existe
    if (user) {
      this.userForm.patchValue(user);
    }

    // Poblamos los checkboxes de roles
    this.rolesFormArray.clear();
    this.availableRoles.forEach(role => {
      const isChecked = user?.roles?.includes(role) ?? false;
      this.rolesFormArray.push(this.fb.control(isChecked));
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      console.error("Formulario inválido:", this.userForm.errors);
      return;
    }

    const currentChat = this.store.selectSnapshot(ChatState.currentChat);
    if (!currentChat) {
      console.error("No hay un chat seleccionado para realizar la operación.");
      return;
    }
    const formValue = this.userForm.value;

    // Convertimos los arrays de booleans (true/false) a arrays de valores reales
    const selectedRoles = formValue.roles
      .map((checked: boolean, i: number) => checked ? this.availableRoles[i] : null)
      .filter((value: string | null): value is string => value !== null);

    const allChats = this.store.selectSnapshot(ChatState.chats);

    // Creamos el payload final
    const finalUserData: Partial<User> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      username: formValue.username,
      roles: selectedRoles,
    };

    if (this.isEditMode && this.userId) {
      // Update user
      // Ahora pasamos los 3 argumentos que la acción espera: id, chatId, y los datos.
      this.store.dispatch(new UpdateUser(this.userId, finalUserData))
        .subscribe(() => {
          this.router.navigate(['/users']);
        });
    } else {
      // Create nuevo user
      this.store.dispatch(new CreateUser(finalUserData, formValue.password))
        .subscribe(() => {
          this.router.navigate(['/users']);
        });
    }
  }
}