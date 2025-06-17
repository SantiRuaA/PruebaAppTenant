import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { map, Observable, tap } from 'rxjs';
import { AuthState } from '../../state/auth/auth.state';
import { TenantState } from '../../state/tenant/tenant.state';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { User } from '../../shared/models/user.model';
import { Tenant } from '../../shared/models/tenant.model';
import { DocumentState, DocumentStateModel } from '../../state/document/document.state';
import { UserState, UserStateModel } from '../../state/user/user.state';
import { RouterLink } from '@angular/router';
import { LoadUsers } from '../../state/user/user.actions';
import { LoadTenants } from '../../state/tenant/tenant.actions';
import { LoadDocuments } from '../../state/document/document.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{
  user$: Observable<User | null>;
  currentTenant$: Observable<Tenant | null>;
  documentPagination$: Observable<DocumentStateModel['pagination']>;
  userPagination$: Observable<UserStateModel['pagination']>;
  tenants$: Observable<Tenant[]>;
  isLoading$: Observable<boolean>;
  isAdmin$: Observable<boolean>
  // Inyectamos el Store y ASIGNAMOS MANUALMENTE cada observable.
  constructor(private store: Store) {
    this.user$ = this.store.select(AuthState.user);
    this.currentTenant$ = this.store.select(TenantState.currentTenant);
    this.documentPagination$ = this.store.select(DocumentState.pagination);
    this.userPagination$ = this.store.select(UserState.pagination);
    this.tenants$ = this.store.select(TenantState.tenants);

    // Un solo 'loading' que es true si CUALQUIERA de los estados está cargando
    this.isLoading$ = this.store.select(state => 
      state.auth.loading || state.user.loading || state.tenant.loading || state.document.loading
    );
    
    // 3. Derivamos isAdmin$ del user$ que acabamos de inicializar
    this.isAdmin$ = this.user$.pipe(
      map(user => user?.roles.includes('admin') ?? false)
    );
  }
  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    const currentUser = this.store.selectSnapshot(AuthState.user);
    if (!currentUser) return;

    // Despachamos la carga de usuarios
    this.store.dispatch(new LoadUsers());

    // Despachamos la carga de tenants Y encadenamos la carga de documentos
    this.store.dispatch(new LoadTenants()).pipe(
      // Usamos tap para reaccionar cuando la acción LoadTenants (y su servicio) termine
      tap(() => {
        // Una vez que los tenants han sido cargados, el TenantState ya ha seleccionado uno por defecto.
        // Ahora podemos pedir los documentos para ese tenant.
        const currentTenantId = this.store.selectSnapshot(TenantState.currentTenantId);
        if (currentTenantId) {
          this.store.dispatch(new LoadDocuments(currentTenantId));
        }
      })
    ).subscribe();
  }

}