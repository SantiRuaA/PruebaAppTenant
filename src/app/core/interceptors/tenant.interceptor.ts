import  { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { Store } from "@ngxs/store"
import { TenantState } from "../../state/tenant/tenant.state"

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store)
  const selectedTenant = store.selectSnapshot(TenantState.currentTenant)

  // Only add tenant header for API requests that should be tenant-specific
  if (selectedTenant && req.url.includes("/api/") && !req.url.includes("/auth/") && !req.url.includes("/tenants/")) {
    const tenantReq = req.clone({
      setHeaders: {
        "X-Tenant-ID": selectedTenant.id.toString(),
      },
    })
    return next(tenantReq)
  }

  return next(req)
}