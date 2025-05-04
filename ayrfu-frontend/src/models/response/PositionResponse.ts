export interface PositionResponse {
    id: number;
    title: string;
    description?: string;
    technology: string;
    location: string;
    languages: string[];
    experienceLevel: string;
    workModel: string;
    active: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }