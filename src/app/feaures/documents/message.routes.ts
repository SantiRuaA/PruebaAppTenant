import  { Routes } from "@angular/router"
import { MessageListComponent } from "./message-list/message-list.component"
import { MessageDetailComponent } from "./message-detail/message-detail.component"
import { MessageFormComponent } from "./message-form/message-form.component"

export const DOCUMENTS_ROUTES: Routes = [
  { path: "", component: MessageListComponent },
  { path: "new", component: MessageFormComponent },
  { path: ":id", component: MessageDetailComponent },
  { path: ":id/edit", component: MessageFormComponent },
]