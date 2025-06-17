import { Injectable } from "@angular/core"
import  { HttpClient, HttpHeaders } from "@angular/common/http"
import  { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { environment } from "../../../enviroments/environment"
import  { User } from "../../shared/models/user.model"
import  { PaginatedResponse } from "../../shared/models/paginated-response.model"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getUsers(page = 0, limit = 10): Observable<PaginatedResponse<User>> {
    // 2. Creamos la cabecera explícita que sí funciona
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const url = `${this.apiUrl}/users?limit=${limit}&skip=${page * limit}`;

    // 3. Hacemos la llamada GET pasando las cabeceras como opción
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
    return this.http.get<any>(`${this.apiUrl}/users/${id}`).pipe(map(this.mapDummyJsonUser))
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/users/add`, userData).pipe(map(this.mapDummyJsonUser))
  }

  updateUser(id: number, tenantId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, userData).pipe(map(this.mapDummyJsonUser))
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`).pipe(map((response) => response.isDeleted || true))
  }

  private mapDummyJsonUser(userData: any): User {
    const adminUserIds = [1, 2, 3, 4, 5]; // IDs que serán admin
    let assignedRoles = ['user'];
    if (adminUserIds.includes(userData.id)) {
      assignedRoles.push('admin');
    }

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      gender: userData.gender,
      
      roles: assignedRoles,
      
      tenantIds: [1, 2],
    };
  }
}