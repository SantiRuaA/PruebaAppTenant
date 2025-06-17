import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
  selector: "app-file-upload",
  standalone: true,
  templateUrl: "./file-upload.component.html",
})
export class FileUploadComponent {
  @Input() accept = "*/*"
  @Input() multiple = false
  @Input() maxSize = 5 * 1024 * 1024 // 5MB default
  @Output() filesSelected = new EventEmitter<File[]>()

  dragOver = false
  files: File[] = []
  error = ""

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) {
      this.handleFiles(input.files)
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.dragOver = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.dragOver = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.dragOver = false

    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files)
    }
  }

  private handleFiles(fileList: FileList): void {
    this.error = ""
    const files: File[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]

      // Check file size
      if (file.size > this.maxSize) {
        this.error = `File ${file.name} exceeds the maximum size of ${this.formatSize(this.maxSize)}`
        continue
      }

      files.push(file)

      // If not multiple, only take the first valid file
      if (!this.multiple && files.length > 0) {
        break
      }
    }

    if (files.length > 0) {
      this.files = this.multiple ? [...this.files, ...files] : files
      this.filesSelected.emit(this.files)
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1)
    this.filesSelected.emit(this.files)
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}