import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
})
export class ConfirmDialogComponent {
  @Input() title = "Confirm Action"
  @Input() message = "Are you sure you want to perform this action?"
  @Input() confirmText = "Confirm"
  @Input() cancelText = "Cancel"
  @Input() confirmButtonClass = "bg-red-600 hover:bg-red-700"
  @Input() isOpen = false

  @Output() confirm = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>()

  onConfirm(): void {
    this.confirm.emit()
    this.isOpen = false
  }

  onCancel(): void {
    this.cancel.emit()
    this.isOpen = false
  }
}