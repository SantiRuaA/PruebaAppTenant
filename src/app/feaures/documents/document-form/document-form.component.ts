import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import  { ActivatedRoute, Router, RouterLink } from "@angular/router"
import  { Store } from "@ngxs/store"
import  { Observable } from "rxjs"
import { CommonModule } from "@angular/common"
import { LoadDocument, CreateDocument, UpdateDocument } from "../../../state/document/document.actions"
import { DocumentState } from "../../../state/document/document.state"
import { AuthState } from "../../../state/auth/auth.state"
import { TenantState } from "../../../state/tenant/tenant.state"
import  { DocumentService } from "../../../core/services/document.service"

@Component({
  selector: "app-document-form",
  standalone: true,
  imports: [ RouterLink, CommonModule, ReactiveFormsModule ],
  templateUrl: "./document-form.component.html",
})
export class DocumentFormComponent implements OnInit {
  documentForm!: FormGroup
  isEditMode = false
  documentId: number | null = null
  loading$: Observable<boolean>
  error$: Observable<string | null>
  selectedFile: File | null = null
  uploadedFileUrl: string | null = null
  tags: string[] = []

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
  ) {
    this.loading$ = this.store.select(DocumentState.loading)
    this.error$ = this.store.select(DocumentState.error)
  }

  ngOnInit(): void {
    this.initForm()

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.documentId = Number(id)
      this.loadDocument(Number(id))
    }
  }

  initForm(): void {
    this.documentForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
    })
  }

  loadDocument(id: number): void {
    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant)

    if (currentTenant) {
      this.store.dispatch(new LoadDocument(id, currentTenant.id)).subscribe({
        next: () => {
          const document = this.store.selectSnapshot(DocumentState.selectedDocument)
          if (document) {
            this.documentForm.patchValue({
              name: document.name,
              description: document.description,
            })
            this.uploadedFileUrl = document.fileUrl
            this.tags = [...document.tags]
          }
        },
      })
    }
  }

  onSubmit(): void {
    if (this.documentForm.invalid) {
      return
    }

    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant)
    const currentUser = this.store.selectSnapshot(AuthState.user)

    if (!currentTenant || !currentUser) {
      return
    }

    const formData = this.documentForm.value

    if (this.isEditMode && this.documentId) {
      // Update existing document
      this.store
        .dispatch(
          new UpdateDocument(this.documentId, currentTenant.id, {
            name: formData.name,
            description: formData.description,
            tags: this.tags,
            // Only update fileUrl if a new file was uploaded
            ...(this.uploadedFileUrl && { fileUrl: this.uploadedFileUrl }),
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(["/documents", this.documentId])
          },
        })
    } else {
      // Create new document
      if (!this.uploadedFileUrl) {
        // Can't create a document without a file
        return
      }

      this.store
        .dispatch(
          new CreateDocument({
            name: formData.name,
            description: formData.description,
            fileUrl: this.uploadedFileUrl,
            userId: currentUser.id,
            tenantId: currentTenant.id,
            tags: this.tags,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(["/documents"])
          },
        })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
      this.uploadFile()
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return

    const currentTenant = this.store.selectSnapshot(TenantState.currentTenant)
    if (!currentTenant) return

    this.documentService.uploadFile(this.selectedFile, currentTenant.id).subscribe({
      next: (response) => {
        this.uploadedFileUrl = response.fileUrl
      },
      error: (error) => {
        console.error("Error uploading file:", error)
      },
    })
  }

  addTag(tag: string): void {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag)
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag)
  }
}