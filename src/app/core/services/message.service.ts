import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { environment } from "../../../enviroments/environment"
import { Message } from "../../shared/models/message.model"
import { PaginatedResponse } from "../../shared/models/paginated-response.model"

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private apiUrl = environment.apiUrl

  // Message para la prueba
  private mockMessages: Message[] = [
    { id: 1, chatId: 1, sender: 'user', content: 'Parce, ¿y si vamos a Santa Marta?', createdAt: new Date(), userId: 1 },
    { id: 2, chatId: 1, sender: 'bot', content: '¡De una! Es un gran destino.', createdAt: new Date(), userId: 99 }, // 99 para el bot
    { id: 3, chatId: 2, sender: 'user', content: '¿Qué ingredientes necesito para el sancocho?', createdAt: new Date(), userId: 1 },
    { id: 4, chatId: 3, sender: 'user', content: '¿Como comprar BitCoin Barato?', createdAt: new Date(), userId: 23 },
  ];

  constructor(private http: HttpClient) { }

  getMessages(chatId: number): Observable<Message[]> {
    const messages = this.mockMessages.filter(m => m.chatId === chatId);
    return of(messages);
  }

  getMessageById(id: number, chatId: number): Observable<Message> {
    // En una app real esto es una llamada a la api
    const message = this.mockMessages.find((d) => d.id === id && d.chatId === chatId)
    if (!message) {
      throw new Error("Message no encontrado")
    }
    return of(message)
  }

  createMessage(messageData: Partial<Message>): Observable<Message> {
    const newMessage: Message = {
        id: this.mockMessages.length + 1,
        chatId: messageData.chatId || 0,
        sender: 'user',
        content: messageData.content || '',
        createdAt: new Date(),
        userId: messageData.userId || 0,
    };
    this.mockMessages = [...this.mockMessages, newMessage];
    // En una app real, podrías simular la respuesta del bot aquí
    return of(newMessage);
  }

  updateMessage(id: number, chatId: number, messageData: Partial<Message>): Observable<Message> {
    // En una app real esto es una llamada a la api
    const index = this.mockMessages.findIndex((d) => d.id === id && d.chatId === chatId)
    if (index !== -1) {
      this.mockMessages[index] = {
        ...this.mockMessages[index],
        ...messageData,
      }
      return of(this.mockMessages[index])
    }
    throw new Error("Message no encontrados")
  }

  deleteMessage(id: number, chatId: number): Observable<boolean> {
    // En una app real esto es una llamada a la api
    const index = this.mockMessages.findIndex((d) => d.id === id && d.chatId === chatId)
    if (index !== -1) {
      this.mockMessages.splice(index, 1)
      return of(true)
    }
    return of(false)
  }

  uploadFile(file: File, chatId: number): Observable<{ fileUrl: string }> {
    // En una app real esto hay que subirlo al servidor o a la nube
    // Para la demo lo damos como exitoso
    return of({ fileUrl: `assets/documents/${file.name}` })
  }
}