import { Component,  OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import  { Store } from "@ngxs/store"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {

  }
}