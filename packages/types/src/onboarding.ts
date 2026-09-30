export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in seconds
}

export interface AuthResponse {
  userId: string;
  email: string;
  session?: AuthSession;
}

export interface RefreshSessionRequest {
  refreshToken: string;
}
