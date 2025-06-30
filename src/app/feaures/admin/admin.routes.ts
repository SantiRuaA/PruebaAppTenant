import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
  },
  {
    path: 'chats', // La ruta final será /admin/chats
    loadChildren: () => import('./chats/chats.routes').then(m => m.CHATS_ROUTES)
  },
  {
    path: '',
    redirectTo: 'users', // Por defecto, la sección de admin va a la lista de usuarios
    pathMatch: 'full'
  }
];