import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CreateChat } from '../../../state/chat/chat.actions';
import { AuthState } from '../../../state/auth/auth.state';

@Component({
  selector: 'app-new-chat-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Iniciar Nueva Conversación</h2>
      <form [formGroup]="chatForm" (ngSubmit)="onSubmit()">
        <label for="name" class="block text-sm font-medium text-gray-700">Título del Chat</label>
        <input id="name" formControlName="name" class="mt-1 block w-full rounded-md ...">
        <button type="submit" [disabled]="chatForm.invalid" class="mt-4 ...">
          Crear Chat
        </button>
      </form>
    </div>
  `
})
export class NewChatFormComponent {
  chatForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.chatForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.chatForm.invalid) return;
    
    const currentUser = this.store.selectSnapshot(AuthState.user);
    if (!currentUser) return;

    this.store.dispatch(new CreateChat({
      name: this.chatForm.value.name,
      userId: currentUser.id
    })).subscribe(() => {
      this.router.navigate(['/dashboard']); 
    });
  }
}