export interface Role {
    id?: number;
    name: string;
    description?: string;
  }
  
  export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    roles: Role[];
  }