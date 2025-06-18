import  { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { Store } from "@ngxs/store"
import { TenantState } from "../../state/tenant/tenant.state"

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store)
  const selectedTenant = store.selectSnapshot(TenantState.currentTenant)

  //Que la URL incluya /api/ (es decir, es una llamada al backend), Que NO sea una ruta relacionada con /auth/ o /tenants/, donde probablemente no se necesita enviar el tenant (por ejemplo: login o seleccionar tenant).
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