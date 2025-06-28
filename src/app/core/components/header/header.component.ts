import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../state/auth/auth.state';
import { ChatState } from '../../../state/chat/chat.state';
import { Logout } from '../../../state/auth/auth.actions';
import { SelectChat, LoadChats } from '../../../state/chat/chat.actions';
import { User } from '../../../shared/models/user.model';
import { Chat } from '../../../shared/models/chat.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html', // Usamos el archivo externo
})
export class HeaderComponent {
  // --- Selectors para obtener datos reactivos del store ---
  user$: Observable<User | null>;
  currentChat$: Observable<Chat | null>;

  isDropdownOpen = false;

  constructor(private store: Store) {
    this.user$ = this.store.select(AuthState.user);
    this.currentChat$ = this.store.select(ChatState.currentChat);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.store.dispatch(new Logout());
    this.isDropdownOpen = false;
  }
}