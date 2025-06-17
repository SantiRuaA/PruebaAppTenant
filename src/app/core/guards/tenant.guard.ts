import { inject } from "@angular/core"
import { Router,  CanActivateFn } from "@angular/router"
import { Store } from "@ngxs/store"
import { map } from "rxjs"
import { TenantState } from "../../state/tenant/tenant.state"

export const tenantGuard: CanActivateFn = (route, state) => {
  const store = inject(Store)
  const router = inject(Router)

  return store.select(TenantState.currentTenant).pipe(
    map((tenant) => {
      if (tenant) {
        return true
      }

      // Redirect to tenant selection
      return router.createUrlTree(["/select-tenant"])
    }),
  )
}