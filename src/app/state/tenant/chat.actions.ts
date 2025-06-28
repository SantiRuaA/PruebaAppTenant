import { Tenant } from "../../shared/models/chat.model"

export class LoadTenants {
  static readonly type = "[Tenant] Load Tenants"
  constructor() { }
}

export class LoadTenant {
  static readonly type = "[Tenant] Load Tenant";
  constructor(public id: number) { }
}

export class LoadTenantsSuccess {
  static readonly type = "[Tenant] Load Tenants Success"
  constructor(public tenants: Tenant[]) { }
}

export class LoadTenantsFailure {
  static readonly type = "[Tenant] Load Tenants Failure"
  constructor(public error: string) { }
}

export class ChangeTenant {
  static readonly type = "[Tenant] Change Tenant"
  constructor(public tenantId: number) { }
}

export class CreateTenant {
  static readonly type = "[Tenant] Create Tenant"
  constructor(public tenantData: Partial<Tenant>) { }
}

export class UpdateTenant {
  static readonly type = "[Tenant] Update Tenant"
  constructor(
    public id: number,
    public tenantData: Partial<Tenant>,
  ) { }
}

export class DeleteTenant {
  static readonly type = "[Tenant] Delete Tenant"
  constructor(public id: number) { }
}