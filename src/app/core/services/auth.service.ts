import { Injectable } from "@angular/core"
import  { HttpClient, HttpHeaders } from "@angular/common/http"
import { BehaviorSubject, Observable, of } from "rxjs"
import { map, tap } from "rxjs/operators"
import { environment } from "../../../enviroments/environment"
import  { User } from "../../shared/models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { username, password, expiresInMins: 60 };

    return this.http.post<any>(`${this.apiUrl}/user/login`, body, { headers: headers });
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/add`, userData);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    console.log(`[AuthService] Cambio de contraseña solicitado por ${email}`);
    return of({ message: "Email de cambio de contraseña enviado" }).pipe(tap(() => setTimeout(() => {}, 1000)));
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    console.log(`[AuthService] Intento de reseteo de contraseña con token ${token}`);
    return of({ message: "Contraseña actializada con exito" }).pipe(tap(() => setTimeout(() => {}, 1000)));
  }
}