import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState } from '../../state/user/user.state'; 
import { LoadUsers } from '../../state/user/user.actions'; 
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  @Select(UserState.users) users$!: Observable<User[]>;
  @Select(UserState.loading) loading$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadUsers());
  }
}