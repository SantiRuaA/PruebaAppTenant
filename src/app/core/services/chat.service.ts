import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { environment } from "../../../enviroments/environment"
import { Chat } from "../../shared/models/chat.model"

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private apiUrl = environment.apiUrl

  // Chat para la prueba
  private mockChats: Chat[] = [
    { id: 1, userId: 1, name: 'Ideas para el viaje', lastMessageAt: new Date() },
    { id: 2, userId: 1, name: 'Receta de sancocho', lastMessageAt: new Date() },
    { id: 3, userId: 12, name: 'Como Comprar BitCoin Barato', lastMessageAt: new Date() },
  ]

  constructor(private http: HttpClient) { }

  getChats(userId: number): Observable<Chat[]> {
    
    // En una app real, la API haría este filtro. Aquí lo simulamos.
    const userChats = this.mockChats.filter(chat => chat.userId === userId);
    return of([...userChats]);
  }

  getChat(id: number): Observable<Chat> {
    // // En una app real esto es una llamada a la api
    const chat = this.mockChats.find((t) => t.id === id)
    if (!chat) {
      throw new Error("Chat no encontrados")
    }
    return of({ ...chat })
  }

  getAllChats(): Observable<Chat[]> {
    return of([...this.mockChats]);
  }

  public getMockChats(): Chat[] {
    return this.mockChats;
  }

  createChat(chatData: Partial<Chat>): Observable<Chat> {
    const newChat: Chat = {
      id: Math.max(...this.mockChats.map(c => c.id)) + 1,
      name: chatData.name || 'Nuevo Chat',
      userId: chatData.userId || 0,
      lastMessageAt: new Date(),
    };
    this.mockChats = [...this.mockChats, newChat];
    return of(newChat);
  }

  updateChat(id: number, chatData: Partial<Chat>): Observable<Chat> {
    let updatedChat: Chat | undefined;
    this.mockChats = this.mockChats.map((chat) => {
      if (chat.id === id) {
        updatedChat = { ...chat, ...chatData };
        return updatedChat;
      }
      return chat;
    });

    if (!updatedChat) {
      throw new Error("Chats no encontrados para actualizar");
    }
    return of(updatedChat);
  }

  deleteChat(id: number): Observable<boolean> {
    const initialLength = this.mockChats.length;
    this.mockChats = this.mockChats.filter((chat) => chat.id !== id);

    return of(this.mockChats.length < initialLength);
  }
}