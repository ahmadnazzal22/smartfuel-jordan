export interface ApiResponse<T> {
  data: T;
  meta?: { page?: number; total?: number; limit?: number };
}

export interface ApiError {
  error: { code: string; message: string; details?: Record<string, any> };
}

export type UserRole = "citizen" | "station_owner" | "dispatcher" | "analyst" | "administrator" | "cabinet_member";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}
