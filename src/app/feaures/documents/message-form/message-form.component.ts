import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { Store } from "@ngxs/store"
import { Observable } from "rxjs"
import { CommonModule } from "@angular/common"
import { LoadMessage, CreateMessage, UpdateMessage } from "../../../state/message/message.actions"
import { MessageState } from "../../../state/message/message.state"
import { AuthState } from "../../../state/auth/auth.state"
import { ChatState } from "../../../state/chat/chat.state"
import { MessageService } from "../../../core/services/message.service"

@Component({
  selector: "app-message-form",
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: "./message-form.component.html",
})
export class MessageFormComponent implements OnInit {
  messageForm!: FormGroup
  isEditMode = false
  messageId: number | null = null
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
    private messageService: MessageService,
  ) {
    this.loading$ = this.store.select(MessageState.loading)
    this.error$ = this.store.select(MessageState.error)
  }

  ngOnInit(): void {
    this.initForm()

    // Verificar si esta en modo de edicion
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.messageId = Number(id)
      this.loadMessage(Number(id))
    }
  }

  initForm(): void {
    this.messageForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
    })
  }

  loadMessage(id: number): void {
    const currentChat = this.store.selectSnapshot(ChatState.currentChat)

    if (currentChat) {
      this.store.dispatch(new LoadMessage(id, currentChat.id)).subscribe({
        next: () => {
          const message = this.store.selectSnapshot(MessageState.selectedMessage)
          if (message) {
            this.messageForm.patchValue({
              name: message.name,
              description: message.description,
            })
            this.uploadedFileUrl = message.fileUrl
            this.tags = [...message.tags]
          }
        },
      })
    }
  }

  onSubmit(): void {
    if (this.messageForm.invalid) {
      return
    }

    const currentChat = this.store.selectSnapshot(ChatState.currentChat)
    const currentUser = this.store.selectSnapshot(AuthState.user)

    if (!currentChat || !currentUser) {
      return
    }

    const formData = this.messageForm.value

    if (this.isEditMode && this.messageId) {
      // Actualizar mensaje existente
      this.store
        .dispatch(
          new UpdateMessage(this.messageId, currentChat.id, {
            name: formData.name,
            description: formData.description,
            tags: this.tags,
            // Solo actualizar si en fileUrl subiron nuevo archivo
            ...(this.uploadedFileUrl && { fileUrl: this.uploadedFileUrl }),
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(["/messages", this.messageId])
          },
        })
    } else {
      // Crear nuevo mensaje
      if (!this.uploadedFileUrl) {
        // No se puede crear mensaje sin archivo
        return
      }

      this.store
        .dispatch(
          new CreateMessage({
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
            this.router.navigate(["/messages"])
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

    const currentChat = this.store.selectSnapshot(ChatState.currentChat)
    if (!currentChat) return

    this.messageService.uploadFile(this.selectedFile, currentChat.id).subscribe({
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