import { Injectable } from "@angular/core"
import { State, Action, StateContext, Selector, Store } from "@ngxs/store"
import { tap, catchError, switchMap } from "rxjs/operators"
import { of } from "rxjs"
import { ChatService } from "../../core/services/chat.service"
import { Chat } from "../../shared/models/chat.model"
import { AuthState } from "../auth/auth.state"
import {
  LoadChats,
  LoadChatsSuccess,
  LoadChatsFailure,
  SelectChat,
  CreateChat,
  UpdateChat,
  DeleteChat,
  LoadChat,
} from "./chat.actions"
import { LoadMessages } from "../message/message.actions"
import { Navigate } from "@ngxs/router-plugin"
import { Logout } from "../auth/auth.actions"

export interface ChatStateModel {
  chats: Chat[]
  currentChatId: number | null
  selectedChat: Chat | null
  loading: boolean
  error: string | null
}

@State<ChatStateModel>({
  name: "chat",
  defaults: {
    chats: [],
    currentChatId: null,
    selectedChat: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class ChatState {
  private static readonly DEFAULTS = {
    chats: [],
    currentChatId: null,
    selectedChat: null,
    loading: false,
    error: null,
  };

  constructor(private chatService: ChatService, private store: Store) { }

  @Selector()
  static chats(state: ChatStateModel): Chat[] {
    return state.chats
  }

  @Selector()
  static selectedChat(state: ChatStateModel): Chat | null {
    return state.selectedChat;
  }

  @Selector()
  static currentChatId(state: ChatStateModel): number | null {
    return state.currentChatId
  }

  @Selector()
  static currentChat(state: ChatStateModel): Chat | null {
    if (!state.currentChatId) return null
    return state.chats.find((chat) => chat.id === state.currentChatId) || null
  }

  @Selector()
  static loading(state: ChatStateModel): boolean {
    return state.loading
  }

  @Selector()
  static error(state: ChatStateModel): string | null {
    return state.error
  }

  @Action(LoadChats)
  loadChats(ctx: StateContext<ChatStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.chatService.getAllChats().pipe(
      switchMap((allChats) => {
        // Esto despacha la acción de éxito y devuelve el observable resultante,
        // forzando a la cadena original a esperar a que esta segunda acción termine.
        return ctx.dispatch(new LoadChatsSuccess(allChats));
      }),
      catchError((error) => {
        return ctx.dispatch(new LoadChatsFailure(error.message || "Fallo en cargar los chats"));
      })
    );
  }

  @Action(LoadChat)
  loadChat(ctx: StateContext<ChatStateModel>, action: LoadChat) {
    ctx.patchState({ loading: true, error: null });

    return this.chatService.getChat(action.id).pipe(
      tap((chat) => {
        ctx.patchState({
          selectedChat: chat,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo en cargar los chats",
        });
        return of(error);
      })
    );
  }

  @Action(LoadChatsSuccess)
  loadChatsSuccess(ctx: StateContext<ChatStateModel>, action: LoadChatsSuccess) {
    const allChats = action.chats;
    const user = this.store.selectSnapshot(AuthState.user);

    let chatsForUser: Chat[];
    // Si el array de roles del usuario incluye 'admin'...
    if (user && user.roles.includes('admin')) {
      // ...le asignamos la lista COMPLETA de chats.
      chatsForUser = allChats;
    } else {
      const allowedChatIds = user?.chatIds || [];
      chatsForUser = allChats.filter(chat => allowedChatIds.includes(chat.id));
    }

    const currentChatId = ctx.getState().currentChatId || (chatsForUser.length > 0 ? chatsForUser[0].id : null);

    ctx.patchState({
      chats: chatsForUser, // Guardamos la lista correcta (completa o filtrada)
      loading: false,
      currentChatId: currentChatId,
    });
  }

  @Action(LoadChatsFailure)
  loadChatFailure(ctx: StateContext<ChatStateModel>, action: LoadChatsFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(SelectChat)
  selectChat(ctx: StateContext<ChatStateModel>, action: SelectChat) {
    ctx.patchState({ currentChatId: action.chatId });
    // Al seleccionar un chat, inmediatamente pedimos sus mensajes.
    return ctx.dispatch(new LoadMessages(action.chatId));
  }

  @Action(CreateChat)
  createChat(ctx: StateContext<ChatStateModel>, action: CreateChat) {
    ctx.patchState({ loading: true, error: null })

    return this.chatService.createChat(action.chatData).pipe(
      tap((newChat) => {
        const state = ctx.getState()
        ctx.patchState({
          chats: [...state.chats, newChat],
          loading: false,
        })
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo al crear el chat",
        })
        return of(error)
      }),
    )
  }

  @Action(UpdateChat)
  updateChat(ctx: StateContext<ChatStateModel>, action: UpdateChat) {
    ctx.patchState({ loading: true, error: null })

    return this.chatService.updateChat(action.id, action.chatData).pipe(
      tap((updatedChat) => {
        const state = ctx.getState()
        const chats = state.chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))

        ctx.patchState({
          chats,
          loading: false,
        })
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo al actualizar el chat",
        })
        return of(error)
      }),
    )
  }

  @Action(DeleteChat)
  deleteChat(ctx: StateContext<ChatStateModel>, action: DeleteChat) {
    ctx.patchState({ loading: true, error: null })

    return this.chatService.deleteChat(action.id).pipe(
      tap((success) => {
        if (success) {
          const state = ctx.getState();
          const chats = state.chats.filter((chat) => chat.id !== action.id);

          let newCurrentChatId = state.currentChatId;
          if (newCurrentChatId === action.id) {
            newCurrentChatId = chats.length > 0 ? chats[0].id : null;
          }
          ctx.patchState({
            chats,
            currentChatId: newCurrentChatId,
            loading: false,
          });
        }
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || "Fallo al eliminar el chat",
        })
        return of(error)
      }),
    )
  }

  @Action(Logout)
  resetOnLogout(ctx: StateContext<ChatStateModel>) {
    // Resetea este slice del estado a sus valores iniciales
    ctx.setState(ChatState.DEFAULTS);
  }
}