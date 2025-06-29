import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule, Store } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";

import { routes } from "./app.routes";
import { AuthState } from "./state/auth/auth.state";
import { UserState } from "./state/user/user.state";
import { ChatState } from "./state/chat/chat.state";
import { MessageState } from "./state/message/message.state";
import { SessionRestored } from "./state/auth/auth.actions";
import { forkJoin, of, switchMap } from "rxjs";
import { LoadChats } from "./state/chat/chat.actions";
import { LoadUsers } from "./state/user/user.actions";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      NgxsModule.forRoot([AuthState, UserState, ChatState, MessageState], {
        developmentMode: true
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ["auth.token", "auth.user", "chat.currentChatId"],
      }),
      NgxsRouterPluginModule.forRoot(),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const store = inject(Store); 

        const token = store.selectSnapshot(AuthState.token);
        if (!token) {
          return () => of(true);
        }
        return () => store.dispatch(new SessionRestored()).pipe(
          switchMap(() => {
            return forkJoin([
              store.dispatch(new LoadChats()),
              store.dispatch(new LoadUsers())
            ]);
          })
        );
      },
      multi: true,
    },
  ],
};



