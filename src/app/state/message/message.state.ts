import { Injectable } from "@angular/core"
import { State, Action, StateContext, Selector } from "@ngxs/store"
import { tap, catchError } from "rxjs/operators"
import { of } from "rxjs"
import { MessageService } from "../../core/services/message.service"
import { Message } from "../../shared/models/message.model"
import {
  LoadMessages,
  LoadMessagesSuccess,
  LoadMessagesFailure,
  LoadMessage,
  LoadMessageSuccess,
  LoadMessageFailure,
  CreateMessage,
  CreateMessageSuccess,
  CreateMessageFailure,
  UpdateMessage,
  UpdateMessageSuccess,
  UpdateMessageFailure,
  DeleteMessage,
  DeleteMessageSuccess,
  DeleteMessageFailure,
  UploadFile,
  UploadFileSuccess,
  UploadFileFailure,
  SetMessageFilters,
  ResetMessageFilters,
} from "./message.actions"
import { Logout } from "../auth/auth.actions"

export interface MessageStateModel {
  messages: Message[]
  selectedMessage: Message | null
  pagination: {
    total: number
    page: number
    limit: number
  };
  filters: {
    search?: string;
    tags?: string[];
  };
  uploadedFileUrl: string | null
  loading: boolean
  error: string | null
}

@State<MessageStateModel>({
  name: "message",
  defaults: {
    messages: [],
    selectedMessage: null,
    pagination: {
      total: 0,
      page: 0,
      limit: 10,
    },
    filters: {
      search: undefined,
      tags: [],
    },
    uploadedFileUrl: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class MessageState {
  private static readonly DEFAULTS = {
    messages: [],
    selectedMessage: null,
    pagination: { total: 0, page: 0, limit: 10 },
    filters: { search: undefined, tags: [] },
    uploadedFileUrl: null,
    loading: false,
    error: null,
  };
  constructor(private messageService: MessageService) { }

  @Selector()
  static messages(state: MessageStateModel): Message[] {
    return state.messages
  }

  @Selector()
  static selectedMessage(state: MessageStateModel): Message | null {
    return state.selectedMessage
  }

  @Selector()
  static pagination(state: MessageStateModel): { total: number; page: number; limit: number } {
    return state.pagination
  }

  @Selector()
  static filters(state: MessageStateModel): { search?: string; tags?: string[] } {
    return state.filters;
  }

  @Selector()
  static uploadedFileUrl(state: MessageStateModel): string | null {
    return state.uploadedFileUrl
  }

  @Selector()
  static loading(state: MessageStateModel): boolean {
    return state.loading
  }

  @Selector()
  static error(state: MessageStateModel): string | null {
    return state.error
  }

  @Action(LoadMessages)
  loadMessages(ctx: StateContext<MessageStateModel>, action: LoadMessages) {
    ctx.patchState({ loading: true, error: null })
    return this.messageService
      .getMessages(action.chatId, action.page, action.limit, action.search, action.tags)
      .pipe(
        tap((response) => {
          ctx.dispatch(new LoadMessagesSuccess(response))
        }),
        catchError((error) => {
          ctx.dispatch(new LoadMessagesFailure(error.message || "Failed to load Message"))
          return of(error)
        }),
      )
  }

  @Action(LoadMessagesSuccess)
  loadMessagesSuccess(ctx: StateContext<MessageStateModel>, action: LoadMessagesSuccess) {
    ctx.patchState({
      messages: action.response.items,
      pagination: {
        total: action.response.total,
        page: action.response.page,
        limit: action.response.limit,
      },
      loading: false,
    })
  }

  @Action(LoadMessagesFailure)
  loadMessagesFailure(ctx: StateContext<MessageStateModel>, action: LoadMessagesFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(LoadMessage)
  loadMessage(ctx: StateContext<MessageStateModel>, action: LoadMessage) {
    ctx.patchState({ loading: true, error: null })

    return this.messageService.getMessageById(action.id, action.chatId).pipe(
      tap((message) => {
        ctx.dispatch(new LoadMessageSuccess(message))
      }),
      catchError((error) => {
        ctx.dispatch(new LoadMessageFailure(error.message || "Failed to load Message"))
        return of(error)
      }),
    )
  }

  @Action(LoadMessageSuccess)
  loadMessageSuccess(ctx: StateContext<MessageStateModel>, action: LoadMessageSuccess) {
    ctx.patchState({
      selectedMessage: action.message,
      loading: false,
    })
  }

  @Action(LoadMessageFailure)
  loadMessageFailure(ctx: StateContext<MessageStateModel>, action: LoadMessageFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(SetMessageFilters)
  setMessageFilters(ctx: StateContext<MessageStateModel>, action: SetMessageFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters, // Mantiene los filtros que no cambian
        search: action.search,
        tags: action.tags,
      },
    });
  }

  @Action(ResetMessageFilters)
  resetMessageFilters(ctx: StateContext<MessageStateModel>) {
    ctx.patchState({
      filters: { // Resetea a los valores por defecto
        search: undefined,
        tags: [],
      },
    });
  }


  @Action(CreateMessage)
  createMessage(ctx: StateContext<MessageStateModel>, action: CreateMessage) {
    ctx.patchState({ loading: true, error: null })

    return this.messageService.createMessage(action.message).pipe(
      tap((message) => {
        ctx.dispatch(new CreateMessageSuccess(message))
      }),
      catchError((error) => {
        ctx.dispatch(new CreateMessageFailure(error.message || "Failed to create Message"))
        return of(error)
      }),
    )
  }

  @Action(CreateMessageSuccess)
  createMessageSuccess(ctx: StateContext<MessageStateModel>, action: CreateMessageSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      messages: [...state.messages, action.message],
      selectedMessage: action.message,
      loading: false,
      uploadedFileUrl: null, // despues de que se crea porque no lo subimos a ningun lado
    })
  }

  @Action(CreateMessageFailure)
  createMessageFailure(ctx: StateContext<MessageStateModel>, action: CreateMessageFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(UpdateMessage)
  updateMessage(ctx: StateContext<MessageStateModel>, action: UpdateMessage) {
    ctx.patchState({ loading: true, error: null })

    return this.messageService.updateMessage(action.id, action.chatId, action.message).pipe(
      tap((message) => {
        ctx.dispatch(new UpdateMessageSuccess(message))
      }),
      catchError((error) => {
        ctx.dispatch(new UpdateMessageFailure(error.message || "Failed to update Message"))
        return of(error)
      }),
    )
  }

  @Action(UpdateMessageSuccess)
  updateMessageSuccess(ctx: StateContext<MessageStateModel>, action: UpdateMessageSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      messages: state.messages.map((doc) => (doc.id === action.message.id ? action.message : doc)),
      selectedMessage: action.message,
      loading: false,
    })
  }

  @Action(UpdateMessageFailure)
  updateMessageFailure(ctx: StateContext<MessageStateModel>, action: UpdateMessageFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(DeleteMessage)
  deleteMessage(ctx: StateContext<MessageStateModel>, action: DeleteMessage) {
    ctx.patchState({ loading: true, error: null })

    return this.messageService.deleteMessage(action.id, action.chatId).pipe(
      tap((success) => {
        if (success) {
          ctx.dispatch(new DeleteMessageSuccess(action.id))
        } else {
          ctx.dispatch(new DeleteMessageFailure("Failed to delete Message"))
        }
      }),
      catchError((error) => {
        ctx.dispatch(new DeleteMessageFailure(error.message || "Failed to delete Message"))
        return of(error)
      }),
    )
  }

  @Action(DeleteMessageSuccess)
  deleteMessageSuccess(ctx: StateContext<MessageStateModel>, action: DeleteMessageSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      messages: state.messages.filter((doc) => doc.id !== action.id),
      selectedMessage: state.selectedMessage?.id === action.id ? null : state.selectedMessage,
      loading: false,
    })
  }

  @Action(DeleteMessageFailure)
  deleteMessageFailure(ctx: StateContext<MessageStateModel>, action: DeleteMessageFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(UploadFile)
  uploadFile(ctx: StateContext<MessageStateModel>, action: UploadFile) {
    ctx.patchState({ loading: true, error: null, uploadedFileUrl: null })

    return this.messageService.uploadFile(action.file, action.chatId).pipe(
      tap((response) => {
        ctx.dispatch(new UploadFileSuccess(response.fileUrl))
      }),
      catchError((error) => {
        ctx.dispatch(new UploadFileFailure(error.message || "Failed to upload file"))
        return of(error)
      }),
    )
  }

  @Action(UploadFileSuccess)
  uploadFileSuccess(ctx: StateContext<MessageStateModel>, action: UploadFileSuccess) {
    ctx.patchState({
      uploadedFileUrl: action.fileUrl,
      loading: false,
    })
  }

  @Action(UploadFileFailure)
  uploadFileFailure(ctx: StateContext<MessageStateModel>, action: UploadFileFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(Logout)
  resetOnLogout(ctx: StateContext<MessageStateModel>) {
    ctx.setState(MessageState.DEFAULTS);
  }
}