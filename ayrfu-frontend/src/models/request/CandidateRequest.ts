export interface CandidateRequest {
    fullName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string; // ISO date string
    gender?: string;
    technologies?: string[];
    languages?: string[];
    experienceLevel?: string;
    preferredLocation?: string;
    preferredWorkModel?: string;
  }