import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { Store } from "@ngxs/store"
import { Observable } from "rxjs"
import { CommonModule } from "@angular/common"
import { LoadDocument, CreateDocument, UpdateDocument } from "../../../state/document/message.actions"
import { DocumentState } from "../../../state/document/message.state"
import { AuthState } from "../../../state/auth/auth.state"
import { TenantState } from "../../../state/tenant/chat.state"
import { DocumentService } from "../../../core/services/document.service"

@Component({
  selector: "app-document-form",
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
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

    // Verificar si esta en modo de edicion
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
      // Actualizar documento existente
      this.store
        .dispatch(
          new UpdateDocument(this.documentId, currentTenant.id, {
            name: formData.name,
            description: formData.description,
            tags: this.tags,
            // Solo actualizar si en fileUrl subiron nuevo archivo
            ...(this.uploadedFileUrl && { fileUrl: this.uploadedFileUrl }),
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(["/documents", this.documentId])
          },
        })
    } else {
      // Crear nuevo documento
      if (!this.uploadedFileUrl) {
        // No se puede crear documento sin archivo
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