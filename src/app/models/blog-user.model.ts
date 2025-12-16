/**
 * 👤 Blog User Models for RealWorld API
 */

export interface BlogUser {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface BlogUserResponse {
  user: BlogUser;
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterRequest {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface UpdateUserRequest {
  user: {
    email?: string;
    username?: string;
    bio?: string;
    image?: string;
    password?: string;
  };
}
