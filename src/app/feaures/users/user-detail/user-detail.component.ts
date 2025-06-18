import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { filter, Observable, take } from 'rxjs';
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
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  
  confirmDelete = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user$ = this.store.select(UserState.selectedUser);
    this.loading$ = this.store.select(UserState.loading);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    // 3. Lógica para esperar a que los datos estén listos
    this.store.select(UserState.users).pipe(
      filter(users => users.length > 0), // Espera a que el array de usuarios tenga contenido
      take(1) // Se ejecuta una sola vez y se desuscribe automáticamente
    ).subscribe(() => {
      // Ahora que la lista está cargada, pedimos el usuario específico.
      this.store.dispatch(new LoadUser(id));
    });
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
    return 'bg-green-100 text-green-800';
  }
}