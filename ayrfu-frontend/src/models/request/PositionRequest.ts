export interface PositionRequest {
    title: string;
    description?: string;
    technology: string;
    location: string;
    languages: string[];
    experienceLevel: string;
    workModel: string;
    active?: boolean;
  }