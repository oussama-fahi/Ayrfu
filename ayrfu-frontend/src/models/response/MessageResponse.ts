import { MessageType } from '../request/MessageRequest';

export interface MessageResponse {
  id: number;
  type: MessageType;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  content: string;
  sentAt: string; // ISO date string
  read: boolean;
  readAt?: string; // ISO date string
}