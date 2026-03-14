import type { LoginCredientialDto, LoginDto } from "~/types";
import { post, put } from "~/api/http/request";
import {
  validateLoginPayload,
  validatePasswordResetToken,
  validateRegisterPayload,
  validateResetPasswordPayload,
  validateStudentNumber,
} from "~/api/validation/auth.validation";

export interface RegisterPayload {
  studentNumber: string;
  name: string;
  password: string;
  email: string;
}

export interface ResetPasswordPayload {
  passwordResetToken: string;
  password: string;
}

export function login(payload: LoginDto) {
  return post<LoginCredientialDto, LoginDto>("/authentication/login", validateLoginPayload(payload));
}

export function register(payload: RegisterPayload) {
  return post<void, RegisterPayload>("/authentication/register", validateRegisterPayload(payload));
}

export function sendResetEmail(studentNumber: string) {
  return post<void>(`/authentication/reset/${validateStudentNumber(studentNumber)}`);
}

export function activateAccount(emailActivateToken: string) {
  return post<LoginCredientialDto>(
    `/authentication/activate/${encodeURIComponent(validatePasswordResetToken(emailActivateToken))}`
  );
}

export function resetPassword(payload: ResetPasswordPayload) {
  return put<LoginCredientialDto, ResetPasswordPayload>(
    "/authentication/password",
    validateResetPasswordPayload(payload)
  );
}
