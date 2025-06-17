import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

type SpinnerSize = "sm" | "md" | "lg"

@Component({
  selector: "app-loading-spinner",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center" [ngClass]="containerClasses">
      <div [ngClass]="spinnerClasses" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() size: SpinnerSize = "md"
  @Input() fullScreen = false

  get containerClasses(): string {
    return this.fullScreen ? "fixed inset-0 bg-white bg-opacity-75 z-50" : ""
  }

  get spinnerClasses(): string {
    const baseClasses = "animate-spin rounded-full border-t-transparent"

    switch (this.size) {
      case "sm":
        return `${baseClasses} w-4 h-4 border-2 border-blue-500`
      case "lg":
        return `${baseClasses} w-12 h-12 border-4 border-blue-500`
      case "md":
      default:
        return `${baseClasses} w-8 h-8 border-4 border-blue-500`
    }
  }
}