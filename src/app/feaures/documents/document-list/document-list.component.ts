import { Component,  OnInit } from "@angular/core"
import  { Store } from "@ngxs/store"
import  { Observable } from "rxjs"
import { LoadDocuments, SetDocumentFilters, ResetDocumentFilters } from "../../../state/document/document.actions"
import { RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { DocumentState } from "../../../state/document/document.state"
import { TenantState } from "../../../state/tenant/tenant.state"
import  { Document } from "../../../shared/models/document.model"
import  { Tenant } from "../../../shared/models/tenant.model"

@Component({
  selector: "app-document-list",
  standalone: true,
  imports: [ RouterLink, CommonModule ],
  templateUrl: "./document-list.component.html",
})
export class DocumentListComponent implements OnInit {
  documents$: Observable<Document[]>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  currentTenant$: Observable<Tenant | null>
  pagination$: Observable<{ total: number; page: number; limit: number }>
  filters$: Observable<{ search?: string; tags?: string[] }>

  selectedTags: string[] = []
  availableTags: string[] = ["financial", "marketing", "project", "proposal", "report", "strategy", "meeting"]

  constructor(private store: Store) {
    this.documents$ = this.store.select(DocumentState.documents)
    this.loading$ = this.store.select(DocumentState.loading)
    this.error$ = this.store.select(DocumentState.error)
    this.currentTenant$ = this.store.select(TenantState.currentTenant)
    this.pagination$ = this.store.select(DocumentState.pagination)
    this.filters$ = this.store.select(DocumentState.filters)
  }

  ngOnInit(): void {
    this.loadDocuments()
  }

  loadDocuments(): void {
    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant)
    if (currentTenant) {
      const filters = this.store.selectSnapshot(DocumentState.filters)
      const pagination = this.store.selectSnapshot(DocumentState.pagination)

      this.store.dispatch(
        new LoadDocuments(currentTenant.id, pagination.page, pagination.limit, filters.search, filters.tags),
      )
    }
  }

  onSearch(search: string): void {
    this.store.dispatch(new SetDocumentFilters(search, this.selectedTags))
    this.loadDocuments()
  }

  onTagsChange(tags: string[]): void {
    this.selectedTags = tags
    this.store.dispatch(new SetDocumentFilters(this.store.selectSnapshot(DocumentState.filters).search, tags))
    this.loadDocuments()
  }

  resetFilters(): void {
    this.selectedTags = []
    this.store.dispatch(new ResetDocumentFilters())
    this.loadDocuments()
  }

  onPageChange(page: number): void {
    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant)
    const filters = this.store.selectSnapshot(DocumentState.filters)
    const pagination = this.store.selectSnapshot(DocumentState.pagination)

    if (currentTenant) {
      this.store.dispatch(new LoadDocuments(currentTenant.id, page, pagination.limit, filters.search, filters.tags))
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
}