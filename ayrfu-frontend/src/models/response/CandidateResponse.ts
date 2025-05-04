export interface CandidateResponse {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string; // ISO date string
    gender?: string;
    technologies: string[];
    languages: string[];
    experienceLevel?: string;
    preferredLocation?: string;
    preferredWorkModel?: string;
    cvPath?: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }