// User role type
export type UserRole = "ADMIN" | "COMUM";

// User model from Prisma (without password)
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Auth DTOs
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  access_token: string;
}

// Password Reset DTOs
export interface RequestResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
