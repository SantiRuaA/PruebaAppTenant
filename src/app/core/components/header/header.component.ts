import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../state/auth/auth.state';
import { TenantState } from '../../../state/tenant/tenant.state';
import { Logout } from '../../../state/auth/auth.actions';
import { ChangeTenant, LoadTenants } from '../../../state/tenant/tenant.actions';
import { User } from '../../../shared/models/user.model';
import { Tenant } from '../../../shared/models/tenant.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html', // Usamos el archivo externo
})
export class HeaderComponent {
  // --- Selectors para obtener datos reactivos del store ---
  user$: Observable<User | null>;
  tenants$: Observable<Tenant[]>;
  currentTenant$: Observable<Tenant | null>;

  isDropdownOpen = false;
  isTenantDropdownOpen = false;

  constructor(private store: Store) {
    this.user$ = this.store.select(AuthState.user);
    this.tenants$ = this.store.select(TenantState.tenants);
    this.currentTenant$ = this.store.select(TenantState.currentTenant);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleTenantDropdown(): void {
    this.isTenantDropdownOpen = !this.isTenantDropdownOpen;
    // Si abrimos el dropdown de tenants y no hay tenants, los cargamos.
    const tenants = this.store.selectSnapshot(TenantState.tenants);
    if (this.isTenantDropdownOpen && tenants.length === 0) {
      const user = this.store.selectSnapshot(AuthState.user);
      if (user) {
        this.store.dispatch(new LoadTenants());
      }
    }
  }

  changeTenant(tenantId: number): void {
    this.store.dispatch(new ChangeTenant(tenantId));
    this.isTenantDropdownOpen = false;
  }

  logout(): void {
    this.store.dispatch(new Logout());
    this.isDropdownOpen = false;
  }
}