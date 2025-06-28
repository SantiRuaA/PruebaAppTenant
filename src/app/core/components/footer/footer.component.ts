import { Component } from "@angular/core"

@Component({
  selector: "app-footer",
  standalone: true,
  template: `
    <footer class="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-600">
      <p>© 2025 Angular Admin App. All rights reserved.</p>
    </footer>
  `,
})
export class FooterComponent { }