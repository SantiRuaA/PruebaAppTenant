import { Component, EventEmitter, Input,  OnChanges, Output,  SimpleChanges } from "@angular/core"

@Component({
  selector: "app-pagination",
  standalone: true,
  templateUrl: "./pagination.component.html",
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 0
  @Input() pageSize = 10
  @Input() totalItems = 0
  @Output() pageChange = new EventEmitter<number>()

  pages: number[] = []
  totalPages = 0

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["totalItems"] || changes["pageSize"]) {
      this.calculatePages()
    }
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize)

    // Generate array of page numbers to display
    this.pages = []
    const maxPagesToShow = 5

    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 0; i < this.totalPages; i++) {
        this.pages.push(i)
      }
    } else {
      // Show a subset of pages with ellipsis
      const startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2))
      const endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1)

      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i)
      }
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page)
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1)
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1)
  }
}