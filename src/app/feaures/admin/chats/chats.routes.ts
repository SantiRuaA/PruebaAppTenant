import { Routes } from "@angular/router"
import { ChatFormComponent } from "../../chats/chat-form/chat-form.component"
import { ChatViewComponent } from "../../chats/chat-view/chat-view.component"
import { ChatListComponent } from "./chat-list/chat-list.component"

export const CHATS_ROUTES: Routes = [
  { path: "", component: ChatListComponent },
  { path: "new", component: ChatFormComponent },
  { path: ":id/edit", component: ChatFormComponent },
  { path: ":id", component: ChatViewComponent },
]