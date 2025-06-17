import { inject } from "@angular/core"
import { Router,  CanActivateFn } from "@angular/router"
import { Store } from "@ngxs/store"
import { map } from "rxjs"
import { AuthState } from "../../state/auth/auth.state"

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store)
  const router = inject(Router)

  return store.select(AuthState.isAuthenticated).pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true
      }

      // Redirect to login page with return url
      return router.createUrlTree(["/auth/login"], {
        queryParams: { returnUrl: state.url },
      })
    }),
  )
}