import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthState } from '../../state/auth/auth.state';
import { LoadTenants } from '../../state/chat/chat.actions';
import { LoadUsers } from '../../state/user/user.actions';
import { SessionRestored } from '../../state/auth/auth.actions';

// Esta es función "portero"
export function initializeApplication(): () => Observable<any> {
  const store = inject(Store);

  return () => {
    // Usamos selectSnapshot para ver el token que el plugin de storage ya debería haber cargado.
    const token = store.selectSnapshot(AuthState.token);

    // Si no hay token, no hacemos nada y dejamos que la app continúe.
    if (!token) {
      return of(true);
    }

    // --- NUEVA LÓGICA SI SÍ HAY TOKEN ---
    // 1. Despachamos la acción para poner 'isAuthenticated' en 'true' INMEDIATAMENTE.
    return store.dispatch(new SessionRestored()).pipe(
      // 2. Usamos switchMap para encadenar la carga de datos DESPUÉS de restaurar la sesión.
      switchMap(() => {
        const currentUser = store.selectSnapshot(AuthState.user);
        if (currentUser) {
          // 3. Lanzamos las cargas de datos en paralelo y esperamos a que terminen.
          return forkJoin([
            store.dispatch(new LoadTenants()),
            store.dispatch(new LoadUsers())
          ]);
        }
        return of(null);
      })
    );
  };
}