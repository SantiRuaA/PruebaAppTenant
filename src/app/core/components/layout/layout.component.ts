import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "../header/header.component"
import { SidebarComponent } from "../sidebar/sidebar.component"
import { FooterComponent } from "../footer/footer.component"

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar />
      <div class="flex flex-col flex-1 overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-auto p-4">
          <router-outlet />
        </main>
        <app-footer />
      </div>
    </div>
  `,
})
export class LayoutComponent {}