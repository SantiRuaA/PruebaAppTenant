import { Message } from "../../shared/models/message.model"
import { PaginatedResponse } from "../../shared/models/paginated-response.model"

export class LoadMessages {
  static readonly type = "[Message] Load Message"
  constructor(
    public chatId: number,
    public page = 0,
    public limit = 10,
    public search?: string,
    public tags?: string[],
  ) { }
}

export class LoadMessagesSuccess {
  static readonly type = "[Message] Load Message Success"
  constructor(public response: PaginatedResponse<Message>) { }
}

export class LoadMessagesFailure {
  static readonly type = "[Message] Load Message Failure"
  constructor(public error: string) { }
}

export class LoadMessage {
  static readonly type = "[Message] Load Message"
  constructor(
    public id: number,
    public chatId: number,
  ) { }
}

export class LoadMessageSuccess {
  static readonly type = "[Message] Load Message Success"
  constructor(public message: Message) { }
}

export class LoadMessageFailure {
  static readonly type = "[Message] Load Message Failure"
  constructor(public error: string) { }
}

export class CreateMessage {
  static readonly type = "[Message] Create Message"
  constructor(public message: Partial<Message>) { }
}

export class CreateMessageSuccess {
  static readonly type = "[Message] Create Message Success"
  constructor(public message: Message) { }
}

export class CreateMessageFailure {
  static readonly type = "[Message] Create Message Failure"
  constructor(public error: string) { }
}

export class UpdateMessage {
  static readonly type = "[Message] Update Message"
  constructor(
    public id: number,
    public chatId: number,
    public message: Partial<Message>,
  ) { }
}

export class UpdateMessageSuccess {
  static readonly type = "[Message] Update Message Success"
  constructor(public message: Message) { }
}

export class UpdateMessageFailure {
  static readonly type = "[Message] Update Message Failure"
  constructor(public error: string) { }
}

export class DeleteMessage {
  static readonly type = "[Message] Delete Message"
  constructor(
    public id: number,
    public chatId: number,
  ) { }
}

export class DeleteMessageSuccess {
  static readonly type = "[Message] Delete Message Success"
  constructor(public id: number) { }
}

export class DeleteMessageFailure {
  static readonly type = "[Message] Delete Message Failure"
  constructor(public error: string) { }
}

export class UploadFile {
  static readonly type = "[Message] Upload File"
  constructor(
    public file: File,
    public chatId: number,
  ) { }
}

export class UploadFileSuccess {
  static readonly type = "[Message] Upload File Success"
  constructor(public fileUrl: string) { }
}

export class UploadFileFailure {
  static readonly type = "[Message] Upload File Failure"
  constructor(public error: string) { }
}

export class SetMessageFilters {
  static readonly type = "[Message] Set Filters";
  constructor(public search?: string, public tags?: string[]) { }
}

export class ResetMessageFilters {
  static readonly type = "[Message] Reset Filters";
}