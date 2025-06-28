import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthState } from '../../../state/auth/auth.state';
import { ChatState } from '../../../state/chat/chat.state';
import { User } from '../../../shared/models/user.model';
import { Chat } from '../../../shared/models/chat.model';
import { SelectChat } from '../../../state/chat/chat.actions';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  // Propiedad para el menú móvil
  isMobileMenuOpen = false;

  // --- Observables que se conectan al estado de NGXS ---
  isAdmin$: Observable<boolean>;
  chats$: Observable<Chat[]>;
  currentChatId$: Observable<number | null>;

  constructor(private store: Store) {
    // Inicializamos todos los observables en el constructor (el método moderno)
    this.isAdmin$ = this.store.select(AuthState.user).pipe(
      map(user => user?.roles.includes('admin') ?? false)
    );

    this.chats$ = this.store.select(ChatState.chats);

    this.currentChatId$ = this.store.select(ChatState.currentChatId);
  }

  ngOnInit(): void {
    // La carga inicial de datos ya la maneja el APP_INITIALIZER y el Login,
    // así que el ngOnInit de la sidebar puede quedar limpio.
  }

  // Método para cambiar el chat activo al hacer clic en la lista
  selectChat(chatId: number): void {
    this.store.dispatch(new SelectChat(chatId));
    // Si estamos en móvil, cerramos el menú después de seleccionar
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  // Método para abrir/cerrar el menú en móviles
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}