import  { Routes } from "@angular/router"
import { DocumentListComponent } from "./document-list/document-list.component"
import { DocumentDetailComponent } from "./document-detail/document-detail.component"
import { DocumentFormComponent } from "./document-form/document-form.component"

export const DOCUMENTS_ROUTES: Routes = [
  { path: "", component: DocumentListComponent },
  { path: "new", component: DocumentFormComponent },
  { path: ":id", component: DocumentDetailComponent },
  { path: ":id/edit", component: DocumentFormComponent },
]