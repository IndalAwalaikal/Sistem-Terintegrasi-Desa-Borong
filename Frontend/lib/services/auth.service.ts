import { ApiError, apiRequest } from '@/lib/services/api';
import type { AuthSession, LoginInput, RegisterInput, User } from '@/types/user';

export type ChangePasswordInput = { passwordLama: string; passwordBaru: string };

export type RegisterResult = {
  email: string;
  message: string;
  emailSent: boolean;
};

type AuthResponse = {
  user: User;
  token: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

function toSession(response: AuthResponse): AuthSession {
  return { user: response.user, token: response.accessToken || response.token, refreshToken: response.refreshToken, expiresAt: response.expiresAt };
}

export async function loginService(input: LoginInput): Promise<AuthSession> {
  return toSession(await apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: input }));
}

export async function registerService(input: RegisterInput): Promise<RegisterResult> {
  return apiRequest<RegisterResult>('/auth/register', { method: 'POST', body: input });
}

export async function verifyOtpService(email: string, code: string): Promise<AuthSession> {
  return toSession(await apiRequest<AuthResponse>('/auth/verify-otp', { method: 'POST', body: { email, code } }));
}

export async function resendOtpService(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/resend-otp', { method: 'POST', body: { email } });
}

export async function forgotPasswordService(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/forgot-password', { method: 'POST', body: { email } });
}

export async function resetPasswordService(email: string, code: string, passwordBaru: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/reset-password', { method: 'POST', body: { email, code, passwordBaru } });
}

export async function getCurrentUserSession(token: string): Promise<User | null> {
  try {
    return await apiRequest<User>('/auth/me', { auth: true, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function updateProfileService(_id: string, input: Partial<User> & { passwordBaru?: string }): Promise<User> {
  return apiRequest<User>('/users/profile', { method: 'PUT', auth: true, body: input });
}

export async function changePasswordService(_id: string, input: ChangePasswordInput): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>('/auth/change-password', { method: 'POST', auth: true, body: input });
}
