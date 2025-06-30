import { Chat } from "../../shared/models/chat.model"

export class LoadChats {
  static readonly type = "[Chat] Load Chats"
  constructor() { }
}

export class LoadChat {
  static readonly type = "[Chat] Load Chat";
  constructor() { }
}

export class LoadAllChats {
  static readonly type = "[Chat] Load All Chats";
}

export class LoadAllChatsSuccess {
  static readonly type = "[Chat] Load All Chats Success";
  constructor(public chats: Chat[]) { }
}

export class LoadAllChatsFailure {
  static readonly type = "[Chat] Load All Chats Failure";
  constructor(public error: string) { }
}

export class LoadChatsSuccess {
  static readonly type = "[Chat] Load Chats Success"
  constructor(public chats: Chat[]) { }
}

export class LoadChatsFailure {
  static readonly type = "[Chat] Load Chats Failure"
  constructor(public error: string) { }
}

export class SelectChat {
  static readonly type = "[Chat] select Chat"
  constructor(public chatId: number) { }
}

export class CreateChat {
  static readonly type = "[Chat] Create Chat"
  constructor(public chatData: Partial<Chat>) { }
}

export class UpdateChat {
  static readonly type = "[Chat] Update Chat"
  constructor(
    public id: number,
    public chatData: Partial<Chat>,
  ) { }
}

export class DeleteChat {
  static readonly type = "[Chat] Delete Chat"
  constructor(public id: number) { }
}