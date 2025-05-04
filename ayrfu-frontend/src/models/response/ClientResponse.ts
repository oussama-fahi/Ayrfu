export interface ClientResponse {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
    phoneNumber?: string;
    industry?: string;
    companySize?: string;
    requirements?: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }