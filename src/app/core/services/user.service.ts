import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, of, throwError } from "rxjs"
import { map } from "rxjs/operators"
import { environment } from "../../../enviroments/environment"
import { User } from "../../shared/models/user.model"
import { PaginatedResponse } from "../../shared/models/paginated-response.model"
import { Chat } from '../../shared/models/chat.model';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.apiUrl

  // Nuestra "base de datos" simulada
  private mockUsers: User[] = [];
  constructor(private http: HttpClient, private chatService: ChatService) { }

  getUsers(page = 0, limit = 10): Observable<PaginatedResponse<User>> {
    // Creamos la cabecera explícita que sí funciona
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const url = `${this.apiUrl}/users?limit=${limit}&skip=${page * limit}`;

    // Hacemos la llamada GET pasando las cabeceras como opción
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => ({
        items: response.users.map((user: any) => this.mapDummyJsonUser(user)),
        total: response.total,
        page,
        limit,
      }))
    );
  }

  getUserById(id: number): Observable<User> {
    const userFromMock = this.mockUsers.find(u => u.id === id);
    if (userFromMock) {
      return of({ ...userFromMock });
    }
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    // Hacemos la llamada GET pasando las cabeceras como opción
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, { headers: headers }).pipe(
      map(userData => this.mapDummyJsonUser(userData))
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    // Simulamos la creación de un nuevo ID
    const newId = (this.mockUsers.length > 0 ? Math.max(...this.mockUsers.map(u => u.id)) : 0) + 1;

    const newUser: User = {
      ...userData,
      id: newId,
      image: `https://dummyjson.com/icon/newuser/128`, // Imagen genérica
    } as User;

    // Añadimos el nuevo usuario a nuestra lista mock
    this.mockUsers = [...this.mockUsers, newUser];

    return of(newUser);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const userIndex = this.mockUsers.findIndex(u => u.id === id);

    if (userIndex > -1) {
      // Fusionamos el usuario existente con los datos nuevos.
      // Las propiedades en 'userData' (como 'roles' y 'tenantIds') sobreescribirán las viejas.
      const updatedUser = { ...this.mockUsers[userIndex], ...userData };
      this.mockUsers[userIndex] = updatedUser;
      return of(updatedUser);
    }

    // Devolvemos un error si no se encuentra el usuario
    return throwError(() => new Error('User not found for update'));
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`).pipe(map((response) => response.isDeleted || true))
  }

  public mapDummyJsonUser(userData: any): User {
    const adminUserIds = [1, 2, 3, 4, 5];
    const assignedRoles = adminUserIds.includes(userData.id) ? ['user', 'admin'] : ['user'];
    
    const allChats = this.chatService.getMockChats(); 
    
    const userChatIds = allChats
      .filter(chat => chat.userId === userData.id)
      .map(chat => chat.id);

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      gender: userData.gender,
      roles: assignedRoles,
      chatIds: userChatIds,
    };
  }
}