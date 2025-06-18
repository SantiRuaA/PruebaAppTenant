import { Injectable } from "@angular/core"
import { State, Action,  StateContext, Selector } from "@ngxs/store"
import { tap, catchError } from "rxjs/operators"
import { of } from "rxjs"
import { UserService } from "../../core/services/user.service"
import  { User } from "../../shared/models/user.model"
import {
  LoadUsers,
  LoadUsersSuccess,
  LoadUsersFailure,
  LoadUser,
  LoadUserSuccess,
  LoadUserFailure,
  CreateUser,
  CreateUserSuccess,
  CreateUserFailure,
  UpdateUser,
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUser,
  DeleteUserSuccess,
  DeleteUserFailure,
} from "./user.actions"
import { Logout } from "../auth/auth.actions"

export interface UserStateModel {
  users: User[]
  selectedUser: User | null
  pagination: {
    total: number
    page: number
    limit: number
  }
  loading: boolean
  error: string | null
}

@State<UserStateModel>({
  name: "user",
  defaults: {
    users: [],
    selectedUser: null,
    pagination: {
      total: 0,
      page: 0,
      limit: 10,
    },
    loading: false,
    error: null,
  },
})
@Injectable()
export class UserState {
  private static readonly DEFAULTS = {
    users: [],
    selectedUser: null,
    pagination: { total: 0, page: 0, limit: 10 },
    loading: false,
    error: null,
  };
  constructor(private userService: UserService) {}

  @Selector()
  static users(state: UserStateModel): User[] {
    return state.users
  }

  @Selector()
  static selectedUser(state: UserStateModel): User | null {
    return state.selectedUser
  }

  @Selector()
  static pagination(state: UserStateModel): { total: number; page: number; limit: number } {
    return state.pagination
  }

  @Selector()
  static loading(state: UserStateModel): boolean {
    return state.loading
  }

  @Selector()
  static error(state: UserStateModel): string | null {
    return state.error
  }

   @Action(LoadUsers)
  loadUsers(ctx: StateContext<UserStateModel>, action: LoadUsers) {
    ctx.patchState({ loading: true, error: null });

    // Simplemente llama al servicio y despacha la acción de éxito o fallo.
    // No actualiza el estado directamente aquí.
    return this.userService.getUsers(action.page, action.limit).pipe(
      tap((response) => {
        ctx.dispatch(new LoadUsersSuccess(response));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadUsersFailure(error.message || "Fallo al cargar los usuarios"));
        return of(error);
      })
    );
  }

  @Action(LoadUsersSuccess)
  loadUsersSuccess(ctx: StateContext<UserStateModel>, action: LoadUsersSuccess) {
    ctx.patchState({
      users: action.response.items,
      pagination: {
        total: action.response.total,
        page: action.response.page,
        limit: action.response.limit,
      },
      loading: false,
    });
  }

  @Action(LoadUser)
  loadUser(ctx: StateContext<UserStateModel>, action: LoadUser) {
    ctx.patchState({ loading: true, error: null });
    return this.userService.getUserById(action.id).pipe(
      tap((user) => ctx.dispatch(new LoadUserSuccess(user))),
      catchError((error) => ctx.dispatch(new LoadUserFailure(error.message || "Fallo al cargar los usuarios")))
    );
  }

  @Action(LoadUserSuccess)
  loadUserSuccess(ctx: StateContext<UserStateModel>, action: LoadUserSuccess) {
    ctx.patchState({
      selectedUser: action.user,
      loading: false,
    });
  }
  
  // --- MANEJADOR DE ERRORES UNIFICADO ---
  // Un solo método para manejar ambos tipos de fallo. ¡Esto elimina el duplicado!
  @Action([LoadUsersFailure, LoadUserFailure])
  loadFailure(ctx: StateContext<UserStateModel>, { error }: { error: string }) {
    ctx.patchState({
      loading: false,
      error: error,
    });
  }

  // El resto de manejadores para Create, Update, Delete
  @Action(CreateUser)
  createUser(ctx: StateContext<UserStateModel>, { userData, password }: CreateUser) {
    ctx.patchState({ loading: true, error: null });
    const payload = { ...userData, password: password };
    return this.userService.createUser(payload).pipe(
      tap((user) => ctx.dispatch(new CreateUserSuccess(user))),
      catchError((error) => ctx.dispatch(new CreateUserFailure(error.message || "Fallo al crear el usuario")))
    );
  }

  @Action(CreateUserSuccess)
  createUserSuccess(ctx: StateContext<UserStateModel>, action: CreateUserSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      users: [...state.users, action.user],
      loading: false
    });
  }

  @Action(CreateUserFailure)
  createUserFailure(ctx: StateContext<UserStateModel>, action: CreateUserFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(UpdateUser)
  updateUser(ctx: StateContext<UserStateModel>, action: UpdateUser) {
    ctx.patchState({ loading: true, error: null })

    return this.userService.updateUser(action.id, action.userData).pipe(
      tap((user) => {
        ctx.dispatch(new UpdateUserSuccess(user))
      }),
      catchError((error) => {
        ctx.dispatch(new UpdateUserFailure(error.message || "Fallo al actualizar el usuario"))
        return of(error)
      }),
    )
  }

  @Action(UpdateUserSuccess)
  updateUserSuccess(ctx: StateContext<UserStateModel>, action: UpdateUserSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      users: state.users.map((user) => (user.id === action.user.id ? action.user : user)),
      selectedUser: action.user,
      loading: false,
    })
  }

  @Action(UpdateUserFailure)
  updateUserFailure(ctx: StateContext<UserStateModel>, action: UpdateUserFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(DeleteUser)
  deleteUser(ctx: StateContext<UserStateModel>, action: DeleteUser) {
    ctx.patchState({ loading: true, error: null })

    return this.userService.deleteUser(action.id).pipe(
      tap((success) => {
        if (success) {
          ctx.dispatch(new DeleteUserSuccess(action.id))
        } else {
          ctx.dispatch(new DeleteUserFailure("Fallo al eliminar el usuario"))
        }
      }),
      catchError((error) => {
        ctx.dispatch(new DeleteUserFailure(error.message || "Fallo al eliminar el usuario"))
        return of(error)
      }),
    )
  }

  @Action(DeleteUserSuccess)
  deleteUserSuccess(ctx: StateContext<UserStateModel>, action: DeleteUserSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      users: state.users.filter((user) => user.id !== action.id),
      selectedUser: state.selectedUser?.id === action.id ? null : state.selectedUser,
      loading: false,
    })
  }

  @Action(DeleteUserFailure)
  deleteUserFailure(ctx: StateContext<UserStateModel>, action: DeleteUserFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(Logout)
  resetOnLogout(ctx: StateContext<UserStateModel>) {
    ctx.setState(UserState.DEFAULTS);
  }
}