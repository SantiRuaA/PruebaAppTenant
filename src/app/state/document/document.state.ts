import { Injectable } from "@angular/core"
import { State, Action,  StateContext, Selector } from "@ngxs/store"
import { tap, catchError } from "rxjs/operators"
import { of } from "rxjs"
import  { DocumentService } from "../../core/services/document.service"
import  { Document } from "../../shared/models/document.model"
import {
  LoadDocuments,
  LoadDocumentsSuccess,
  LoadDocumentsFailure,
  LoadDocument,
  LoadDocumentSuccess,
  LoadDocumentFailure,
  CreateDocument,
  CreateDocumentSuccess,
  CreateDocumentFailure,
  UpdateDocument,
  UpdateDocumentSuccess,
  UpdateDocumentFailure,
  DeleteDocument,
  DeleteDocumentSuccess,
  DeleteDocumentFailure,
  UploadFile,
  UploadFileSuccess,
  UploadFileFailure,
  SetDocumentFilters,
  ResetDocumentFilters,
} from "./document.actions"
import { Logout } from "../auth/auth.actions"

export interface DocumentStateModel {
  documents: Document[]
  selectedDocument: Document | null
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

@State<DocumentStateModel>({
  name: "document",
  defaults: {
    documents: [],
    selectedDocument: null,
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
export class DocumentState {
  private static readonly DEFAULTS = {
    documents: [],
    selectedDocument: null,
    pagination: { total: 0, page: 0, limit: 10 },
    filters: { search: undefined, tags: [] },
    uploadedFileUrl: null,
    loading: false,
    error: null,
  };
  constructor(private documentService: DocumentService) {}

  @Selector()
  static documents(state: DocumentStateModel): Document[] {
    return state.documents
  }

  @Selector()
  static selectedDocument(state: DocumentStateModel): Document | null {
    return state.selectedDocument
  }

  @Selector()
  static pagination(state: DocumentStateModel): { total: number; page: number; limit: number } {
    return state.pagination
  }

  @Selector()
  static filters(state: DocumentStateModel): { search?: string; tags?: string[] } {
    return state.filters;
  }

  @Selector()
  static uploadedFileUrl(state: DocumentStateModel): string | null {
    return state.uploadedFileUrl
  }

  @Selector()
  static loading(state: DocumentStateModel): boolean {
    return state.loading
  }

  @Selector()
  static error(state: DocumentStateModel): string | null {
    return state.error
  }

  @Action(LoadDocuments)
  loadDocuments(ctx: StateContext<DocumentStateModel>, action: LoadDocuments) {
    ctx.patchState({ loading: true, error: null })
    return this.documentService
      .getDocuments(action.tenantId, action.page, action.limit, action.search, action.tags)
      .pipe(
        tap((response) => {
          ctx.dispatch(new LoadDocumentsSuccess(response))
        }),
        catchError((error) => {
          ctx.dispatch(new LoadDocumentsFailure(error.message || "Failed to load documents"))
          return of(error)
        }),
      )
  }

  @Action(LoadDocumentsSuccess)
  loadDocumentsSuccess(ctx: StateContext<DocumentStateModel>, action: LoadDocumentsSuccess) {
    ctx.patchState({
      documents: action.response.items,
      pagination: {
        total: action.response.total,
        page: action.response.page,
        limit: action.response.limit,
      },
      loading: false,
    })
  }

  @Action(LoadDocumentsFailure)
  loadDocumentsFailure(ctx: StateContext<DocumentStateModel>, action: LoadDocumentsFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(LoadDocument)
  loadDocument(ctx: StateContext<DocumentStateModel>, action: LoadDocument) {
    ctx.patchState({ loading: true, error: null })

    return this.documentService.getDocumentById(action.id, action.tenantId).pipe(
      tap((document) => {
        ctx.dispatch(new LoadDocumentSuccess(document))
      }),
      catchError((error) => {
        ctx.dispatch(new LoadDocumentFailure(error.message || "Failed to load document"))
        return of(error)
      }),
    )
  }

  @Action(LoadDocumentSuccess)
  loadDocumentSuccess(ctx: StateContext<DocumentStateModel>, action: LoadDocumentSuccess) {
    ctx.patchState({
      selectedDocument: action.document,
      loading: false,
    })
  }

  @Action(LoadDocumentFailure)
  loadDocumentFailure(ctx: StateContext<DocumentStateModel>, action: LoadDocumentFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(SetDocumentFilters)
  setDocumentFilters(ctx: StateContext<DocumentStateModel>, action: SetDocumentFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters, // Mantiene los filtros que no cambian
        search: action.search,
        tags: action.tags,
      },
    });
  }

  @Action(ResetDocumentFilters)
  resetDocumentFilters(ctx: StateContext<DocumentStateModel>) {
    ctx.patchState({
      filters: { // Resetea a los valores por defecto
        search: undefined,
        tags: [],
      },
    });
  }


  @Action(CreateDocument)
  createDocument(ctx: StateContext<DocumentStateModel>, action: CreateDocument) {
    ctx.patchState({ loading: true, error: null })

    return this.documentService.createDocument(action.document).pipe(
      tap((document) => {
        ctx.dispatch(new CreateDocumentSuccess(document))
      }),
      catchError((error) => {
        ctx.dispatch(new CreateDocumentFailure(error.message || "Failed to create document"))
        return of(error)
      }),
    )
  }

  @Action(CreateDocumentSuccess)
  createDocumentSuccess(ctx: StateContext<DocumentStateModel>, action: CreateDocumentSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      documents: [...state.documents, action.document],
      selectedDocument: action.document,
      loading: false,
      uploadedFileUrl: null, // despues de que se crea porque no lo subimos a ningun lado
    })
  }

  @Action(CreateDocumentFailure)
  createDocumentFailure(ctx: StateContext<DocumentStateModel>, action: CreateDocumentFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(UpdateDocument)
  updateDocument(ctx: StateContext<DocumentStateModel>, action: UpdateDocument) {
    ctx.patchState({ loading: true, error: null })

    return this.documentService.updateDocument(action.id, action.tenantId, action.document).pipe(
      tap((document) => {
        ctx.dispatch(new UpdateDocumentSuccess(document))
      }),
      catchError((error) => {
        ctx.dispatch(new UpdateDocumentFailure(error.message || "Failed to update document"))
        return of(error)
      }),
    )
  }

  @Action(UpdateDocumentSuccess)
  updateDocumentSuccess(ctx: StateContext<DocumentStateModel>, action: UpdateDocumentSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      documents: state.documents.map((doc) => (doc.id === action.document.id ? action.document : doc)),
      selectedDocument: action.document,
      loading: false,
    })
  }

  @Action(UpdateDocumentFailure)
  updateDocumentFailure(ctx: StateContext<DocumentStateModel>, action: UpdateDocumentFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(DeleteDocument)
  deleteDocument(ctx: StateContext<DocumentStateModel>, action: DeleteDocument) {
    ctx.patchState({ loading: true, error: null })

    return this.documentService.deleteDocument(action.id, action.tenantId).pipe(
      tap((success) => {
        if (success) {
          ctx.dispatch(new DeleteDocumentSuccess(action.id))
        } else {
          ctx.dispatch(new DeleteDocumentFailure("Failed to delete document"))
        }
      }),
      catchError((error) => {
        ctx.dispatch(new DeleteDocumentFailure(error.message || "Failed to delete document"))
        return of(error)
      }),
    )
  }

  @Action(DeleteDocumentSuccess)
  deleteDocumentSuccess(ctx: StateContext<DocumentStateModel>, action: DeleteDocumentSuccess) {
    const state = ctx.getState()
    ctx.patchState({
      documents: state.documents.filter((doc) => doc.id !== action.id),
      selectedDocument: state.selectedDocument?.id === action.id ? null : state.selectedDocument,
      loading: false,
    })
  }

  @Action(DeleteDocumentFailure)
  deleteDocumentFailure(ctx: StateContext<DocumentStateModel>, action: DeleteDocumentFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(UploadFile)
  uploadFile(ctx: StateContext<DocumentStateModel>, action: UploadFile) {
    ctx.patchState({ loading: true, error: null, uploadedFileUrl: null })

    return this.documentService.uploadFile(action.file, action.tenantId).pipe(
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
  uploadFileSuccess(ctx: StateContext<DocumentStateModel>, action: UploadFileSuccess) {
    ctx.patchState({
      uploadedFileUrl: action.fileUrl,
      loading: false,
    })
  }

  @Action(UploadFileFailure)
  uploadFileFailure(ctx: StateContext<DocumentStateModel>, action: UploadFileFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
    })
  }

  @Action(Logout)
  resetOnLogout(ctx: StateContext<DocumentStateModel>) {
    ctx.setState(DocumentState.DEFAULTS);
  }
}