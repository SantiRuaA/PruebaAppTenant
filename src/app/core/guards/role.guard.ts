import { inject } from "@angular/core"
import { Router,  CanActivateFn } from "@angular/router"
import { Store } from "@ngxs/store"
import { map } from "rxjs"
import { AuthState } from "../../state/auth/auth.state"

export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const requiredRoles = (route.data?.["roles"] as string[]) || [];

  return store.select(AuthState.user).pipe(
    map((user) => {
      if (!user) {
        return router.createUrlTree(["/auth/login"]);
      }

      // Esta lógica ahora funcionará porque nuestro AuthState enriquece al usuario con roles.
      if (requiredRoles.length === 0 || requiredRoles.some((role) => user.roles.includes(role))) {
        return true;
      }

      // Redirige a la página del dashboard.
      return router.createUrlTree(["/dashboard"]); 
    })
  );
};