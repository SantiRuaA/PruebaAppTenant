import { Component, EventEmitter, Input, Output } from "@angular/core"
import { Subject } from "rxjs"
import { debounceTime, distinctUntilChanged } from "rxjs/operators"

@Component({
  selector: "app-search-bar",
  standalone: true,
  templateUrl: "./search-bar.component.html",
})
export class SearchBarComponent {
  @Input() placeholder = "Search..."
  @Input() value = ""
  @Output() search = new EventEmitter<string>()

  private searchSubject = new Subject<string>()

  constructor() {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.search.emit(value)
    })
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.searchSubject.next(value)
  }

  clearSearch(): void {
    this.value = ""
    this.search.emit("")
  }
}