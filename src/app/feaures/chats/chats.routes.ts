import { Routes } from "@angular/router"
import { ChatListComponent } from "./chat-list/chat-list.component"
import { ChatFormComponent } from "./chat-form/chat-form.component"

export const TENANTS_ROUTES: Routes = [
  { path: "", component: ChatListComponent },
  { path: "new", component: ChatFormComponent },
  { path: ":id/edit", component: ChatFormComponent },
]