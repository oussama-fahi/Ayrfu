export enum MessageType {
    CANDIDATE = 'CANDIDATE',
    CLIENT = 'CLIENT'
  }
  
  export interface MessageRequest {
    type: MessageType;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    content: string;
  }