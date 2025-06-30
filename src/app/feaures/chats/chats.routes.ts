import { Routes } from '@angular/router';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { ChatFormComponent } from './chat-form/chat-form.component';

export const CHAT_ROUTES: Routes = [
  {
    path: 'new',
    component: ChatFormComponent
  },
  {
    // La ruta /chats/:id carga la vista de la conversación
    path: ':id',
    component: ChatViewComponent
  },
  {
    path: '',
    component: ChatViewComponent 
  }
];