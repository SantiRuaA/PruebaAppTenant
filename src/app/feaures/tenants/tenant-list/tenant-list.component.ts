import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadTenants, DeleteTenant } from '../../../state/tenant/chat.actions';
import { TenantState } from '../../../state/tenant/chat.state';
import { AuthState } from '../../../state/auth/auth.state';
import { Tenant } from '../../../shared/models/chat.model';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tenant-list.component.html',
})
export class TenantListComponent implements OnInit {
  tenants$: Observable<Tenant[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  confirmDelete: number | null = null;

  constructor(private store: Store) {
    this.tenants$ = this.store.select(TenantState.tenants);
    this.loading$ = this.store.select(TenantState.loading);
    this.error$ = this.store.select(TenantState.error);
  }

  ngOnInit(): void {
    // Si la lista está vacía, llamarlo como un respaldo.
    const tenants = this.store.selectSnapshot(TenantState.tenants);
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

  onDelete(id: number): void {
    this.store.dispatch(new DeleteTenant(id));
    this.confirmDelete = null;
  }
}