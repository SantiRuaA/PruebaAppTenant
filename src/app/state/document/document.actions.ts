import { Document } from "../../shared/models/document.model"
import { PaginatedResponse } from "../../shared/models/paginated-response.model"

export class LoadDocuments {
  static readonly type = "[Document] Load Documents"
  constructor(
    public tenantId: number,
    public page = 0,
    public limit = 10,
    public search?: string,
    public tags?: string[],
  ) {}
}

export class LoadDocumentsSuccess {
  static readonly type = "[Document] Load Documents Success"
  constructor(public response: PaginatedResponse<Document>) {}
}

export class LoadDocumentsFailure {
  static readonly type = "[Document] Load Documents Failure"
  constructor(public error: string) {}
}

export class LoadDocument {
  static readonly type = "[Document] Load Document"
  constructor(
    public id: number,
    public tenantId: number,
  ) {}
}

export class LoadDocumentSuccess {
  static readonly type = "[Document] Load Document Success"
  constructor(public document: Document) {}
}

export class LoadDocumentFailure {
  static readonly type = "[Document] Load Document Failure"
  constructor(public error: string) {}
}

export class CreateDocument {
  static readonly type = "[Document] Create Document"
  constructor(public document: Partial<Document>) {}
}

export class CreateDocumentSuccess {
  static readonly type = "[Document] Create Document Success"
  constructor(public document: Document) {}
}

export class CreateDocumentFailure {
  static readonly type = "[Document] Create Document Failure"
  constructor(public error: string) {}
}

export class UpdateDocument {
  static readonly type = "[Document] Update Document"
  constructor(
    public id: number,
    public tenantId: number,
    public document: Partial<Document>,
  ) {}
}

export class UpdateDocumentSuccess {
  static readonly type = "[Document] Update Document Success"
  constructor(public document: Document) {}
}

export class UpdateDocumentFailure {
  static readonly type = "[Document] Update Document Failure"
  constructor(public error: string) {}
}

export class DeleteDocument {
  static readonly type = "[Document] Delete Document"
  constructor(
    public id: number,
    public tenantId: number,
  ) {}
}

export class DeleteDocumentSuccess {
  static readonly type = "[Document] Delete Document Success"
  constructor(public id: number) {}
}

export class DeleteDocumentFailure {
  static readonly type = "[Document] Delete Document Failure"
  constructor(public error: string) {}
}

export class UploadFile {
  static readonly type = "[Document] Upload File"
  constructor(
    public file: File,
    public tenantId: number,
  ) {}
}

export class UploadFileSuccess {
  static readonly type = "[Document] Upload File Success"
  constructor(public fileUrl: string) {}
}

export class UploadFileFailure {
  static readonly type = "[Document] Upload File Failure"
  constructor(public error: string) {}
}

export class SetDocumentFilters {
  static readonly type = "[Document] Set Filters";
  constructor(public search?: string, public tags?: string[]) {}
}

export class ResetDocumentFilters {
  static readonly type = "[Document] Reset Filters";
}