import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { map } from 'rxjs';
import { ChatState } from '../../state/chat/chat.state';

export const chatGuard: CanActivateFn = (route, state: RouterStateSnapshot) => {
  const store = inject(Store);
  const router = inject(Router);

  if (state.url.includes('/chats/new')) {
    return true;
  }
  return store.select(ChatState.currentChat).pipe(
    map((chat) => {
      if (chat) {
        return true;
      }
      return router.createUrlTree(['/chats/new']);
    })
  );
};