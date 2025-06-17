import { Component } from "@angular/core";
import { Select } from "@ngxs/store";
import { AuthState } from "../../state/auth/auth.state";
import { User } from "../../shared/models/user.model";
import { Observable } from "rxjs";
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./admin-dashboard.component.html",
})
export class AdminDashboardComponent {
  // Usamos el selector de NGXS para obtener el usuario de forma reactiva
  @Select(AuthState.user) currentUser$!: Observable<User | null>;
  constructor() {}
}