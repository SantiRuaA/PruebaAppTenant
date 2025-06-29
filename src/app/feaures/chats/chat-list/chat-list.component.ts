import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserState } from '../../../state/user/user.state'; 
import { ChatState } from '../../../state/chat/chat.state';
import { Chat } from '../../../shared/models/chat.model';
import { LoadChats, DeleteChat } from '../../../state/chat/chat.actions';
import { LoadUsers } from '../../../state/user/user.actions'; 

export interface EnrichedChat extends Chat {
  userName: string;
}

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit {
  enrichedChats$!: Observable<EnrichedChat[]>; 
  loading$: Observable<boolean>;
  
  confirmDelete: number | null = null;

  constructor(private store: Store) {
    const chats$ = this.store.select(ChatState.chats);
    const users$ = this.store.select(UserState.users);

    this.enrichedChats$ = combineLatest([chats$, users$]).pipe(
      map(([chats, users]) => {
        const userMap = new Map<number, string>();
        users.forEach(user => userMap.set(user.id, `${user.firstName} ${user.lastName}`));
        return chats.map(chat => ({
          ...chat,
          userName: userMap.get(chat.userId) || 'Usuario Desconocido' 
        }));
      })
    );
    const chatLoading$ = this.store.select(ChatState.loading);
    const userLoading$ = this.store.select(UserState.loading);
    this.loading$ = combineLatest([chatLoading$, userLoading$]).pipe(
      map(([chatLoading, userLoading]) => chatLoading || userLoading)
    );
  }

  ngOnInit(): void {
    this.store.dispatch([
      new LoadChats(),
      new LoadUsers()
    ]);
  }

  onDelete(chatId: number): void {
    this.store.dispatch(new DeleteChat(chatId));
    this.confirmDelete = null;
  }
}