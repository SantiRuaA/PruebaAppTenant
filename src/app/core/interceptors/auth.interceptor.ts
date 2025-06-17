import  { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { Store } from "@ngxs/store"
import { AuthState } from "../../state/auth/auth.state"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const token = store.selectSnapshot(AuthState.token); 

  // Definimos las rutas públicas que no necesitan token
  const publicRoutes = ['/user/login', '/users'];

  // Verificamos si la URL de la petición actual contiene alguna de las rutas públicas
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  // Si hay un token y la ruta NO es pública, añadimos la cabecera
  if (token && !isPublicRoute) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};