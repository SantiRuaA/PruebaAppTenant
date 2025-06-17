import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../state/auth/auth.state';
import { Logout } from '../../state/auth/auth.actions';
import { User } from '../../shared/models/user.model';

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule], // Añadimos CommonModule para las directivas
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  @Select(AuthState.user) currentUser$!: Observable<User | null>;

  constructor(private store: Store) {}

  logout(): void {
    this.store.dispatch(new Logout());
  }
}