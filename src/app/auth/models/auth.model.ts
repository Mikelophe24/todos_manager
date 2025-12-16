// 🔐 AUTH MODELS - Định nghĩa các interface cho Authentication

/**
 * Interface cho thông tin User từ API
 */
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

/**
 * Interface cho Login Request
 */
export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number; // Thời gian hết hạn token (mặc định 30 phút)
}

/**
 * Interface cho Login Response từ DummyJSON API
 */
export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Interface cho Refresh Token Request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
  expiresInMins?: number;
}

/**
 * Interface cho Refresh Token Response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Interface cho Register Request
 */
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
}

/**
 * Interface cho Auth State trong Store
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
