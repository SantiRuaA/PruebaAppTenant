export interface Message {
  id: number;
  chatId: number;
  userId: number;
  content: string;
  createdAt: Date;
}