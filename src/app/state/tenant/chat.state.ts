import { Injectable } from "@angular/core"
import { State, Action, StateContext, Selector, Store } from "@ngxs/store"
import { tap, catchError, switchMap } from "rxjs/operators"
import { of } from "rxjs"
import { TenantService } from "../../core/services/tenant.service"
import { Tenant } from "../../shared/models/chat.model"
import { AuthState } from "../auth/auth.state"
import {
  LoadTenants,
  LoadTenantsSuccess,
  LoadTenantsFailure,
  ChangeTenant,
  CreateTenant,
  UpdateTenant,
  DeleteTenant,
  LoadTenant,
} from "./chat.actions"
import { LoadDocuments } from "../document/message.actions"
import { Navigate } from "@ngxs/router-plugin"
import { Logout } from "../auth/auth.actions"

export interface TenantStateModel {
  tenants: Tenant[]
  currentTenantId: number | null
  selectedTenant: Tenant | null
  loading: boolean
  error: string | null
}

@State<TenantStateModel>({
  name: "tenant",
  defaults: {
    tenants: [],
    currentTenantId: null,
    selectedTenant: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class TenantState {
  private static readonly DEFAULTS = {
    tenants: [],
    currentTenantId: null,
    selectedTenant: null,
    loading: false,
    error: null,
  };

  constructor(private tenantService: TenantService, private store: Store) { }

  @Selector()
  static tenants(state: TenantStateModel): Tenant[] {
    return state.tenants
  }

  @Selector()
  static selectedTenant(state: TenantStateModel): Tenant | null {
    return state.selectedTenant;
  }

  @Selector()
  static currentTenantId(state: TenantStateModel): number | null {
    return state.currentTenantId
  }

  @Selector()
  static currentTenant(state: TenantStateModel): Tenant | null {
    if (!state.currentTenantId) return null
    return state.tenants.find((tenant) => tenant.id === state.currentTenantId) || null
  }

  @Selector()
  static loading(state: TenantStateModel): boolean {
    return state.loading
  }

  @Selector()
  static error(state: TenantStateModel): string | null {
    return state.error
  }

  @Action(LoadTenants)
  loadTenants(ctx: StateContext<TenantStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.tenantService.getAllTenants().pipe(
      switchMap((allTenants) => {
        // Esto despacha la acción de éxito y devuelve el observable resultante,
        // forzando a la cadena original a esperar a que esta segunda acción termine.
        return ctx.dispatch(new LoadTenantsSuccess(allTenants));
      }),
      catchError((error) => {
        return ctx.dispatch(new LoadTenantsFailure(error.message || "Fallo en cargar los tenant"));
      })
    );
  }

  @Action(LoadTenant)
  loadTenant(ctx: StateContext<TenantStateModel>, action: LoadTenant) {
    ctx.patchState({ loading: true, error: null });

    return this.tenantService.getTenant(action.id).pipe(
      tap((tenant) => {
        ctx.patchState({
          selectedTenant: tenant,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo en cargar los tenant",
        });
        return of(error);
      })
    );
  }

  @Action(LoadTenantsSuccess)
  loadTenantsSuccess(ctx: StateContext<TenantStateModel>, action: LoadTenantsSuccess) {
    const allTenants = action.tenants;
    const user = this.store.selectSnapshot(AuthState.user);

    let tenantsForUser: Tenant[];
    // Si el array de roles del usuario incluye 'admin'...
    if (user && user.roles.includes('admin')) {
      // ...le asignamos la lista COMPLETA de tenants.
      tenantsForUser = allTenants;
    } else {
      const allowedTenantIds = user?.tenantIds || [];
      tenantsForUser = allTenants.filter(tenant => allowedTenantIds.includes(tenant.id));
    }

    const currentTenantId = ctx.getState().currentTenantId || (tenantsForUser.length > 0 ? tenantsForUser[0].id : null);

    ctx.patchState({
      tenants: tenantsForUser, // Guardamos la lista correcta (completa o filtrada)
      loading: false,
      currentTenantId: currentTenantId,
    });
  }

  @Action(LoadTenantsFailure)
  loadTenantsFailure(ctx: StateContext<TenantStateModel>, action: LoadTenantsFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(ChangeTenant)
  changeTenant(ctx: StateContext<TenantStateModel>, action: ChangeTenant) {
    ctx.patchState({
      currentTenantId: action.tenantId,
    });
    return ctx.dispatch(new LoadDocuments(action.tenantId)).pipe(
      tap(() => {
        ctx.dispatch(new Navigate(['/dashboard']));
      })
    );
  }

  @Action(CreateTenant)
  createTenant(ctx: StateContext<TenantStateModel>, action: CreateTenant) {
    ctx.patchState({ loading: true, error: null })

    return this.tenantService.createTenant(action.tenantData).pipe(
      tap((newTenant) => {
        const state = ctx.getState()
        ctx.patchState({
          tenants: [...state.tenants, newTenant],
          loading: false,
        })
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo al crear el tenant",
        })
        return of(error)
      }),
    )
  }

  @Action(UpdateTenant)
  updateTenant(ctx: StateContext<TenantStateModel>, action: UpdateTenant) {
    ctx.patchState({ loading: true, error: null })

    return this.tenantService.updateTenant(action.id, action.tenantData).pipe(
      tap((updatedTenant) => {
        const state = ctx.getState()
        const tenants = state.tenants.map((tenant) => (tenant.id === updatedTenant.id ? updatedTenant : tenant))

        ctx.patchState({
          tenants,
          loading: false,
        })
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo al actualizar el tenant",
        })
        return of(error)
      }),
    )
  }

  @Action(DeleteTenant)
  deleteTenant(ctx: StateContext<TenantStateModel>, action: DeleteTenant) {
    ctx.patchState({ loading: true, error: null })

    return this.tenantService.deleteTenant(action.id).pipe(
      tap((success) => {
        if (success) {
          const state = ctx.getState()
          const tenants = state.tenants.filter((tenant) => tenant.id !== action.id)

          // si el tenant eliminado es el actual cambia a otro
          let currentTenantId = state.currentTenantId
          if (currentTenantId === action.id) {
            currentTenantId = tenants.length > 0 ? tenants[0].id : null
          }

          ctx.patchState({
            tenants,
            currentTenantId,
            loading: false,
          })
        }
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo al eliminar el tenant",
        })
        return of(error)
      }),
    )
  }

  @Action(Logout)
  resetOnLogout(ctx: StateContext<TenantStateModel>) {
    // Resetea este slice del estado a sus valores iniciales
    ctx.setState(TenantState.DEFAULTS);
  }
}