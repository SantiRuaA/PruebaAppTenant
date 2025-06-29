export interface Chat {
  id: number
  name: string
  userId: number;
  description?: string;
  lastMessageAt: Date;
}