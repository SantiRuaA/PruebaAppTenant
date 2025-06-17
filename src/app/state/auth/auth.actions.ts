import { User } from "../../shared/models/user.model"

export class Login {
  static readonly type = "[Auth] Login"
  constructor(
    public username: string,
    public password: string,
  ) {}
}

export class LoginSuccess {
  static readonly type = "[Auth] Login Success";
  constructor(public user: User, public token: string) {}
}

export class LoginFailure {
  static readonly type = "[Auth] Login Failure"
  constructor(public error: string) {}
}

export class Logout {
  static readonly type = "[Auth] Logout"
}

export class Register {
  static readonly type = "[Auth] Register"
  constructor(public userData: Partial<User>) {}
}

export class RegisterSuccess {
    static readonly type = "[Auth] Register Success";
    constructor(public user: User) {}
}

export class RegisterFailure {
  static readonly type = "[Auth] Register Failure"
  constructor(public error: string) {}
}

export class CheckAuth {
  static readonly type = "[Auth] Check Auth"
}

export class RefreshToken {
  static readonly type = "[Auth] Refresh Token"
  constructor(public refreshToken: string) {}
}

export class UpdateUserProfile {
  static readonly type = "[Auth] Update User Profile"
  constructor(public userData: Partial<User>) {}
}

export class SessionRestored {
  static readonly type = "[Auth] Session Restored";
}