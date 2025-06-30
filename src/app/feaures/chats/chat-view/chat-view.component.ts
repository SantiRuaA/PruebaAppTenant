import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';

import { MessageState } from '../../../state/message/message.state';
import { LoadMessages, CreateMessage } from '../../../state/message/message.actions';
import { Message } from '../../../shared/models/message.model';
import { AuthState } from '../../../state/auth/auth.state';
import { User } from '../../../shared/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './chat-view.component.html',
})
export class ChatViewComponent implements OnInit, OnDestroy {
  // Observables para conectar el template al estado
  messages$: Observable<Message[]>;
  loading$: Observable<boolean>;
  user$: Observable<User | null>;

  messageForm: FormGroup;
  currentChatId: number | null = null;
  private routeSubscription: Subscription;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Inicializamos los observables y el formulario en el constructor
    this.messages$ = this.store.select(MessageState.messages);
    this.loading$ = this.store.select(MessageState.loading);
    this.user$ = this.store.select(AuthState.user);

    this.messageForm = this.fb.group({
      content: ['', Validators.required]
    });

    // Inicializamos la suscripción a la ruta
    this.routeSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentChatId = +id;
        this.store.dispatch(new LoadMessages(this.currentChatId));
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.currentChatId) return;

    const currentUser = this.store.selectSnapshot(AuthState.user);
    if (!currentUser) return;

    const messagePayload: Partial<Message> = {
      chatId: this.currentChatId,
      userId: currentUser.id,
      content: this.messageForm.value.content,
      sender: 'user', // El mensaje siempre lo envía el usuario desde aquí
    };

    // Despachamos la acción para crear un nuevo mensaje
    this.store.dispatch(new CreateMessage(messagePayload));

    // Limpiamos el input después de enviar
    this.messageForm.reset();
  }
}