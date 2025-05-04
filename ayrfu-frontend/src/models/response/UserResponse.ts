import { Role } from '../request/RegisterRequest';

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  active: boolean;
  roles: Role[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}