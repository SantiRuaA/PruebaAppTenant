import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LoadChat, CreateChat, UpdateChat } from '../../../state/chat/chat.actions';
import { ChatState } from '../../../state/chat/chat.state';
import { Chat } from '../../../shared/models/chat.model';

@Component({
  selector: 'app-chat-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './chat-form.component.html',
})
export class ChatFormComponent implements OnInit {
  chatForm!: FormGroup;
  isEditMode = false;
  chatId: number | null = null;

  @Select(ChatState.loading) loading$!: Observable<boolean>;
  @Select(ChatState.error) error$!: Observable<string | null>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.chatId = Number(id);
      this.loadChatForEditing(this.chatId);
    }
  }

  initForm(): void {
    this.chatForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  loadChatForEditing(id: number): void {
    // Despachamos la acción para cargar el tenant en el estado
    this.store.dispatch(new LoadChat(id));

    // Nos suscribimos al selector para rellenar el formulario UNA SOLA VEZ
    this.store.select(ChatState.selectedChat).pipe(
      filter((chat): chat is Chat => chat !== null && chat.id === id), // Nos aseguramos de que no sea nulo y sea el correcto
      take(1) // Tomamos el primer valor y nos desuscribimos automáticamente
    )
      .subscribe((chat) => {
        this.chatForm.patchValue(chat);
      });
  }

  onSubmit(): void {
    if (this.chatForm.invalid) {
      return;
    }

    const formData = this.chatForm.value;

    if (this.isEditMode && this.chatId) {
      this.store.dispatch(new UpdateChat(this.chatId, formData))
        .subscribe(() => {
          this.router.navigate(['/chats']);
        });
    } else {
      this.store.dispatch(new CreateChat(formData))
        .subscribe(() => {
          this.router.navigate(['/chats']);
        });
    }
  }
}