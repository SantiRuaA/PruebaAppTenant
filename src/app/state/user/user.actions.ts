import { User } from "../../shared/models/user.model"
import { PaginatedResponse } from "../../shared/models/paginated-response.model"

export class LoadUsers {
  static readonly type = "[User] Load Users"
  constructor(
    public page = 0,
    public limit = 10,
  ) {}
}

export class LoadUsersSuccess {
  static readonly type = "[User] Load Users Success"
  constructor(public response: PaginatedResponse<User>) {}
}

export class LoadUsersFailure {
  static readonly type = "[User] Load Users Failure"
  constructor(public error: string) {}
}

export class LoadUser {
  static readonly type = "[User] Load User"
  constructor(public id: number) {}
}

export class LoadUserSuccess {
  static readonly type = "[User] Load User Success"
  constructor(public user: User) {}
}

export class LoadUserFailure {
  static readonly type = "[User] Load User Failure"
  constructor(public error: string) {}
}

export class CreateUser {
  static readonly type = "[User] Create User"
  constructor(public userData: Partial<User>, public password?: string) {}
}

export class CreateUserSuccess {
  static readonly type = "[User] Create User Success"
  constructor(public user: User) {}
}

export class CreateUserFailure {
  static readonly type = "[User] Create User Failure"
  constructor(public error: string) {}
}

export class UpdateUser {
  static readonly type = "[User] Update User"
  constructor(
    public id: number,
    public tenantId: number,
    public userData: Partial<User>,
  ) {}
}

export class UpdateUserSuccess {
  static readonly type = "[User] Update User Success"
  constructor(public user: User) {}
}

export class UpdateUserFailure {
  static readonly type = "[User] Update User Failure"
  constructor(public error: string) {}
}

export class DeleteUser {
  static readonly type = "[User] Delete User"
  constructor(public id: number) {}
}

export class DeleteUserSuccess {
  static readonly type = "[User] Delete User Success"
  constructor(public id: number) {}
}

export class DeleteUserFailure {
  static readonly type = "[User] Delete User Failure"
  constructor(public error: string) {}
}