export interface ServiceResponse {
    id: number;
    title: string;
    description?: string;
    benefits?: string;
    availability?: string;
    keywords: string[];
    active: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }