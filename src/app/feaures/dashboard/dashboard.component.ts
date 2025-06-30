import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { combineLatest, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthState } from '../../state/auth/auth.state';
import { ChatState } from '../../state/chat/chat.state';
import { MessageState, MessageStateModel } from '../../state/message/message.state';
import { UserState, UserStateModel } from '../../state/user/user.state';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { User } from '../../shared/models/user.model';
import { Chat } from '../../shared/models/chat.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  user$: Observable<User | null>;
  currentChat$: Observable<Chat | null>;
  userPagination$: Observable<UserStateModel['pagination']>;
  chats$: Observable<Chat[]>;
  allChats$: Observable<Chat[]>
  isLoading$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  constructor(private store: Store) {
    const authLoading$ = this.store.select(AuthState.loading);
    const userLoading$ = this.store.select(UserState.loading);
    const chatLoading$ = this.store.select(ChatState.loading);
    const messageLoading$ = this.store.select(MessageState.loading);
    this.isLoading$ = combineLatest([
      authLoading$,
      userLoading$,
      chatLoading$,
      messageLoading$
    ]).pipe(
      map(([auth, user, chat, message]) => auth || user || chat || message)
    );

    // El resto de las inicializaciones que ya estaban bien
    this.user$ = this.store.select(AuthState.user);
    this.currentChat$ = this.store.select(ChatState.currentChat);
    this.userPagination$ = this.store.select(UserState.pagination);
    this.chats$ = this.store.select(ChatState.chats);
    this.allChats$ = this.store.select(ChatState.allChats)
    this.isAdmin$ = this.user$.pipe(
      map(user => user?.roles.includes('admin') ?? false)
    );
  }
}