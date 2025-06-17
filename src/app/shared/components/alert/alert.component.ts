import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

type AlertType = "success" | "error" | "warning" | "info"

@Component({
  selector: "app-alert",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="alertClasses" role="alert">
      <div class="flex">
        <div class="py-1">
          <ng-container [ngSwitch]="type">
            <!-- Success icon -->
            <svg *ngSwitchCase="'success'" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <!-- Error icon -->
            <svg *ngSwitchCase="'error'" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <!-- Warning icon -->
            <svg *ngSwitchCase="'warning'" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <!-- Info icon -->
            <svg *ngSwitchCase="'info'" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </ng-container>
        </div>
        <div class="ml-3">
          <p class="text-sm">{{ message }}</p>
        </div>
      </div>
    </div>
  `,
})
export class AlertComponent {
  @Input() type: AlertType = "info"
  @Input() message = ""

  get alertClasses(): string {
    const baseClasses = "p-4 rounded-md mb-4"

    switch (this.type) {
      case "success":
        return `${baseClasses} bg-green-50 border border-green-200`
      case "error":
        return `${baseClasses} bg-red-50 border border-red-200`
      case "warning":
        return `${baseClasses} bg-yellow-50 border border-yellow-200`
      case "info":
      default:
        return `${baseClasses} bg-blue-50 border border-blue-200`
    }
  }
}