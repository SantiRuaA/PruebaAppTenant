import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router'; 
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadTenants, ChangeTenant } from '../../../state/tenant/tenant.actions';
import { TenantState } from '../../../state/tenant/tenant.state';
import { AuthState } from '../../../state/auth/auth.state';
import { Tenant } from '../../../shared/models/tenant.model';

@Component({
  selector: 'app-tenant-select',
  standalone: true, 
  imports: [CommonModule, RouterLink], 
  templateUrl: './tenant-select.component.html',
})
export class TenantSelectComponent implements OnInit {
  
  isOpen = false;
  tenants$: Observable<Tenant[]>;
  currentTenant$: Observable<Tenant | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {
    this.tenants$ = this.store.select(TenantState.tenants);
    this.currentTenant$ = this.store.select(TenantState.currentTenant);
    this.loading$ = this.store.select(TenantState.loading);
  }

  ngOnInit(): void {
    const tenants = this.store.selectSnapshot(TenantState.tenants);
    // Si la lista de tenants está vacía al cargar el componente, la pedimos.
    if (tenants.length === 0) {
      const currentUser = this.store.selectSnapshot(AuthState.user);
      if (currentUser) {
        this.store.dispatch(new LoadTenants());
      }
    }
  }

  loadTenants(): void {
    const currentUser = this.store.selectSnapshot(AuthState.user);
    if (currentUser) {
      this.store.dispatch(new LoadTenants());
    }
  }

  selectTenant(tenant: Tenant): void {
    // Despachamos la acción ChangeTenant con el ID del tenant seleccionado
    this.store.dispatch(new ChangeTenant(tenant.id));
    this.isOpen = false; // Cerramos el dropdown
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }
}