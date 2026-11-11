export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string;
  bio?: string;
  twoFactorEnabled?: boolean;
}

export interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'signup' | 'password_changed' | 'profile_updated' | 'password_reset';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}
