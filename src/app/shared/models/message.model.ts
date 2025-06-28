export interface Message {
  id: number;
  chatId: number;
  content: string; 
  sender: 'user' | 'bot'; 
  createdAt: Date;
  userId: number;
}