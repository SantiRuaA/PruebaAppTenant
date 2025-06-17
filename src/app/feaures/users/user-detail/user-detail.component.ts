import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadUser, DeleteUser } from '../../../state/user/user.actions';
import { UserState } from '../../../state/user/user.state';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true, 
  imports: [CommonModule, RouterLink], 
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  @Select(UserState.selectedUser) user$!: Observable<User | null>;
  @Select(UserState.loading) loading$!: Observable<boolean>;
  @Select(UserState.error) error$!: Observable<string | null>;
  
  confirmDelete = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.dispatch(new LoadUser(id));
    }
  }

  onDelete(): void {
    const user = this.store.selectSnapshot(UserState.selectedUser);
    if (user) {
      this.store.dispatch(new DeleteUser(user.id)).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
      });
    }
    this.confirmDelete = false; 
  }

  getRoleBadgeClass(roles: string[]): string {
    if (roles.includes('admin')) return 'bg-red-100 text-red-800';
    if (roles.includes('manager')) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  }
}