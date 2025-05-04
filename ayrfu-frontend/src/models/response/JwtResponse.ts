import { Role } from '../request/RegisterRequest';

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  roles: Role[];
}