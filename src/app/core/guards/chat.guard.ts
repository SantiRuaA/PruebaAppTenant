import { inject } from "@angular/core"
import { Router, CanActivateFn } from "@angular/router"
import { Store } from "@ngxs/store"
import { map } from "rxjs"
import { ChatState } from "../../state/chat/chat.state"

export const chatGuard: CanActivateFn = (route, state) => {
  const store = inject(Store)
  const router = inject(Router)

  return store.select(ChatState.currentChat).pipe(
    map((chat) => {
      if (chat) {
        return true
      }

      // manda a seleccionar chat
      return router.createUrlTree(["/chats/new"])
    }),
  )
}