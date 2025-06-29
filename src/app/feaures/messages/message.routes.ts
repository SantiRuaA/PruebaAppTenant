import  { Routes } from "@angular/router"
import { NewChatFormComponent } from "./message-form/new-chat-form.component"

export const DOCUMENTS_ROUTES: Routes = [
  { path: "new", component: NewChatFormComponent },
  { path: ":id/edit", component: NewChatFormComponent },
]