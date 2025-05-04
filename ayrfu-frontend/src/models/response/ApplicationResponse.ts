import { CandidateResponse } from './CandidateResponse';
import { PositionResponse } from './PositionResponse';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  IN_REVIEW = 'IN_REVIEW',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  TECHNICAL_TEST = 'TECHNICAL_TEST',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED'
}

export interface ApplicationResponse {
  id: number;
  candidate: CandidateResponse;
  position: PositionResponse;
  appliedAt: string; // ISO date string
  coverLetter?: string;
  status: ApplicationStatus;
}