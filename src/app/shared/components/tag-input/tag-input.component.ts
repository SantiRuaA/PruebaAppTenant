import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
  selector: "app-tag-input",
  standalone: true,
  templateUrl: "./tag-input.component.html",
})
export class TagInputComponent {
  @Input() tags: string[] = []
  @Input() placeholder = "Add tags..."
  @Output() tagsChange = new EventEmitter<string[]>()

  newTag = ""

  addTag(): void {
    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      const updatedTags = [...this.tags, this.newTag.trim()]
      this.tags = updatedTags
      this.tagsChange.emit(updatedTags)
      this.newTag = ""
    }
  }

  removeTag(index: number): void {
    const updatedTags = [...this.tags]
    updatedTags.splice(index, 1)
    this.tags = updatedTags
    this.tagsChange.emit(updatedTags)
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      this.addTag()
    }
  }
}