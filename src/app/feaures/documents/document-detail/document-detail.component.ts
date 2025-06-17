import { Component,  OnInit } from "@angular/core"
import  { ActivatedRoute, Router, RouterLink } from "@angular/router"
import  { Store } from "@ngxs/store"
import  { Observable } from "rxjs"
import { CommonModule } from "@angular/common"
import { LoadDocument, DeleteDocument } from "../../../state/document/document.actions"
import { DocumentState } from "../../../state/document/document.state"
import { TenantState } from "../../../state/tenant/tenant.state"
import  { Document } from "../../../shared/models/document.model"

@Component({
  selector: "app-document-detail",
  standalone: true,
  imports: [ RouterLink, CommonModule ],
  templateUrl: "./document-detail.component.html",
})
export class DocumentDetailComponent implements OnInit {
  document$: Observable<Document | null>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  confirmDelete = false

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.document$ = this.store.select(DocumentState.selectedDocument)
    this.loading$ = this.store.select(DocumentState.loading)
    this.error$ = this.store.select(DocumentState.error)
  }

  ngOnInit(): void {
    this.loadDocument()
  }

  loadDocument(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"))
    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant)

    if (currentTenant && id) {
      this.store.dispatch(new LoadDocument(id, currentTenant.id))
    }
  }

  onDelete(): void {
    const document = this.store.selectSnapshot(DocumentState.selectedDocument)
    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant)

    if (document && currentTenant) {
      this.store.dispatch(new DeleteDocument(document.id, currentTenant.id)).subscribe({
        next: () => {
          this.router.navigate(["/documents"])
        },
      })
    }
  }

  getFileIcon(fileUrl: string): string {
    if (fileUrl.endsWith(".pdf")) return "picture_as_pdf"
    if (fileUrl.endsWith(".docx") || fileUrl.endsWith(".doc")) return "article"
    if (fileUrl.endsWith(".pptx") || fileUrl.endsWith(".ppt")) return "slideshow"
    if (fileUrl.endsWith(".xlsx") || fileUrl.endsWith(".xls")) return "table_chart"
    return "description"
  }

  getFileIconColor(fileUrl: string): string {
    if (fileUrl.endsWith(".pdf")) return "text-red-500"
    if (fileUrl.endsWith(".docx") || fileUrl.endsWith(".doc")) return "text-blue-500"
    if (fileUrl.endsWith(".pptx") || fileUrl.endsWith(".ppt")) return "text-orange-500"
    if (fileUrl.endsWith(".xlsx") || fileUrl.endsWith(".xls")) return "text-green-500"
    return "text-gray-500"
  }

  getFile(fileUrl: string): string {
    if (fileUrl.endsWith(".pdf")) return "PDF"
    if (fileUrl.endsWith(".docx") || fileUrl.endsWith(".doc")) return "Word Document"
    if (fileUrl.endsWith(".pptx") || fileUrl.endsWith(".ppt")) return "PowerPoint"
    if (fileUrl.endsWith(".xlsx") || fileUrl.endsWith(".xls")) return "Excel"
    return "Document"
  }
}