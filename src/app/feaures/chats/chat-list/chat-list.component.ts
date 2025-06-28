import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadChats, DeleteChat } from '../../../state/chat/chat.actions';
import { ChatState } from '../../../state/chat/chat.state';
import { AuthState } from '../../../state/auth/auth.state';
import { Chat } from '../../../shared/models/chat.model';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit {
  chats$: Observable<Chat[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  confirmDelete: number | null = null;

  constructor(private store: Store) {
    this.chats$ = this.store.select(ChatState.chats);
    this.loading$ = this.store.select(ChatState.loading);
    this.error$ = this.store.select(ChatState.error);
  }

  ngOnInit(): void {
    // Si la lista está vacía, llamarlo como un respaldo.
    const chats = this.store.selectSnapshot(ChatState.chats);
    if (chats.length === 0) {
      const currentUser = this.store.selectSnapshot(AuthState.user);
      if (currentUser) {
        this.store.dispatch(new LoadChats());
      }
    }
  }

  loadChats(): void {
    const currentUser = this.store.selectSnapshot(AuthState.user);
    if (currentUser) {
      this.store.dispatch(new LoadChats());
    }
  }

  onDelete(id: number): void {
    this.store.dispatch(new DeleteChat(id));
    this.confirmDelete = null;
  }
}