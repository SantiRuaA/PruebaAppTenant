import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../../state/auth/auth.state';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html', // Usamos el archivo externo
})
export class SidebarComponent {
  // Creamos un observable que nos dice si el usuario es admin o no.
  isAdmin$: Observable<boolean>;
  isMobileMenuOpen = false;

  constructor(private store: Store) {
    // Derivamos isAdmin$ del estado del usuario. Es 100% reactivo.
    this.isAdmin$ = this.store.select(AuthState.user).pipe(
      map(user => user?.roles.includes('admin') ?? false)
    );
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}