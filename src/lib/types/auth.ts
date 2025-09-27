
import type { UserRole } from "../../contexts/AppContext";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId?: string;
  licenseNumber?: string;
  specialization?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}