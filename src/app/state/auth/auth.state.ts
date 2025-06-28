import { Injectable } from "@angular/core"
import { State, Action, StateContext, Selector, Store } from "@ngxs/store"
import { tap, catchError, switchMap } from "rxjs/operators"
import { forkJoin, of } from "rxjs"
import { Navigate } from "@ngxs/router-plugin"
import { AuthService } from "../../core/services/auth.service"
import { User } from "../../shared/models/user.model"
import {
  Login,
  LoginSuccess,
  LoginFailure,
  Logout,
  Register,
  RegisterSuccess,
  RegisterFailure,
  CheckAuth,
  UpdateUserProfile,
  SessionRestored,
} from "./auth.actions"
import { UserService } from "../../core/services/user.service"
import { LoadTenants } from "../tenant/chat.actions"
import { LoadUsers } from "../user/user.actions"


export interface AuthStateModel {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  error: string | null
  loading: boolean
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    error: null,
    loading: false,
  },
})
@Injectable()
export class AuthState {
  constructor(
    private authService: AuthService,
    private store: Store,
    private userService: UserService
  ) { }

  @Selector()
  static user(state: AuthStateModel): User | null {
    return state.user
  }

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token
  }

  @Selector()
  static refreshToken(state: AuthStateModel): string | null {
    return state.refreshToken
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated
  }

  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error
  }

  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { username, password }: Login) {
    ctx.patchState({ loading: true, error: null });

    return this.authService.login(username, password).pipe(
      tap((userFromApi: any) => {

        const adminUserIds = [1, 2, 3, 4, 5];

        let assignedRoles = ['user'];

        if (adminUserIds.includes(userFromApi.id)) {

          assignedRoles.push('admin');
        }

        const userForState: User = {
          id: userFromApi.id,
          username: userFromApi.username,
          email: userFromApi.email,
          firstName: userFromApi.firstName,
          lastName: userFromApi.lastName,
          image: userFromApi.image,
          gender: userFromApi.gender,
          token: userFromApi.accessToken,

          roles: assignedRoles,

          tenantIds: [1, 2],
        };

        ctx.dispatch(new LoginSuccess(userForState, userForState.token!));
      }),
      catchError((error) => {
        const errorMessage = error.error?.message || "Login failed";
        ctx.dispatch(new LoginFailure(errorMessage));
        return of(error);
      })
    );
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, { user, token }: LoginSuccess) {
    ctx.patchState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
    localStorage.setItem('authToken', token);

    const dataLoadingActions = [
      new LoadTenants(),
      new LoadUsers()
    ]
    return ctx.dispatch(dataLoadingActions).pipe(
      tap(() => {
        if (user.tenantIds.length > 1) {
          ctx.dispatch(new Navigate(['/select-tenant']));
        } else {
          ctx.dispatch(new Navigate(['/dashboard']));
        }
      })
    );
  }

  @Action(LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: LoginFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    const tokenBefore = localStorage.getItem('authToken');

    // Primero, limpiamos el localStorage de forma manual y explícita.
    localStorage.removeItem('authToken');

    const tokenAfter = localStorage.getItem('authToken');

    ctx.setState({
      user: null,
      token: null,
      refreshToken: null, // resetear todas las propiedades
      isAuthenticated: false,
      error: null,
      loading: false,
    });

    return ctx.dispatch(new Navigate(['/auth/login']));
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, { userData }: Register) {
    ctx.patchState({ loading: true, error: null });
    // Usamos UserService para crear el usuario
    return this.userService.createUser(userData).pipe(
      tap((createdUser) => {
        // El registro fue exitoso, pero no inicia sesión.
        // Podríamos redirigir al login con un mensaje de éxito.
        ctx.dispatch(new RegisterSuccess(createdUser));
      }),
      catchError(error => {
        const errorMessage = error.error?.message || "Registration failed";
        ctx.dispatch(new RegisterFailure(errorMessage));
        return of(error);
      })
    );
  }

  @Action(RegisterSuccess)
  registerSuccess(ctx: StateContext<AuthStateModel>, action: RegisterSuccess) {
    // El registro ya no inicia sesión, solo finaliza el estado de carga.
    ctx.patchState({ loading: false, error: null });
    // Navega al login con un mensaje de éxito
    return ctx.dispatch(new Navigate(['/auth/login'], { success: true }));
  }

  private enrichUser(user: User): User {
    // Aquí aplicamos la lógica de negocio que antes estaba en el servicio
    const enrichedUser = { ...user };
    enrichedUser.roles = (user.id % 2 === 0) ? ['admin', 'user'] : ['user'];
    enrichedUser.tenantIds = [1, 2]; // Simulación
    return enrichedUser;
  }

  @Action(RegisterFailure)
  registerFailure(ctx: StateContext<AuthStateModel>, action: RegisterFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(CheckAuth)
  checkAuth(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState()

    if (state.token && state.user) {
      // Token existe, autentica el usuario
      ctx.patchState({ isAuthenticated: true })
    } else {
      // Token no existe, usuario no autenticado
      ctx.patchState({ isAuthenticated: false })
    }
  }

  @Action(UpdateUserProfile)
  updateUserProfile(ctx: StateContext<AuthStateModel>, action: UpdateUserProfile) {
    const state = ctx.getState()
    if (state.user) {
      ctx.patchState({
        user: { ...state.user, ...action.userData },
      })
    }
  }

  @Action(SessionRestored)
  sessionRestored(ctx: StateContext<AuthStateModel>) {
    // Simplemente ponemos isAuthenticated en true si esta acción se despacha.
    ctx.patchState({ isAuthenticated: true });
  }
}