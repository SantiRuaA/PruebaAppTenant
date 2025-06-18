import { Component,  OnInit } from "@angular/core"
import  { Store } from "@ngxs/store"
import  { Observable } from "rxjs"
import { LoadUsers } from "../../../state/user/user.actions"
import { UserState, UserStateModel } from "../../../state/user/user.state"
import { CommonModule } from "@angular/common"
import { TenantState } from "../../../state/tenant/tenant.state"
import  { User } from "../../../shared/models/user.model"
import  { Tenant } from "../../../shared/models/tenant.model"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [ RouterLink, CommonModule ],
  templateUrl: "./user-list.component.html",
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  currentTenant$: Observable<Tenant | null>
  pagination$!: Observable<UserStateModel['pagination']>
  readonly Math: typeof Math = Math;

  constructor(private store: Store) {
    this.users$ = this.store.select(UserState.users)
    this.loading$ = this.store.select(UserState.loading)
    this.error$ = this.store.select(UserState.error)
    this.currentTenant$ = this.store.select(TenantState.currentTenant)
    this.pagination$ = this.store.select(UserState.pagination);
  }

  ngOnInit(): void {
    this.loadUsers(0)
  }

  loadUsers(page: number): void {
    const pagination = this.store.selectSnapshot(UserState.pagination);
    this.store.dispatch(new LoadUsers(page, pagination?.limit || 10));
  }

  nextPage(): void {
    const pagination = this.store.selectSnapshot(UserState.pagination);
    if (!this.isLastPage()) {
      this.loadUsers(pagination.page + 1);
    }
  }

  previousPage(): void {
    const pagination = this.store.selectSnapshot(UserState.pagination);
    if (!this.isFirstPage()) {
      this.loadUsers(pagination.page - 1);
    }
  }

  isFirstPage(): boolean {
    return this.store.selectSnapshot(UserState.pagination).page === 0;
  }
  
  isLastPage(): boolean {
    const pagination = this.store.selectSnapshot(UserState.pagination);
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    return pagination.page >= totalPages - 1;
  }

  getRoleBadgeClass(roles: string[]): string {
    
    if (roles.includes('admin')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-green-100 text-green-800';
  }
}