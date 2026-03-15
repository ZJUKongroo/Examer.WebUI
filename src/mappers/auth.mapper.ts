import type { LoginDto } from "~/types";
import type { RegisterPayload } from "~/api";

export interface LoginFormValue {
  studentNumber: string;
  password: string;
}

export interface RegisterFormValue extends LoginFormValue {
  name: string;
}

export function buildLoginPayload(form: LoginFormValue): LoginDto {
  return {
    studentNumber: form.studentNumber.trim(),
    password: form.password,
  };
}

export function buildRegisterPayload(form: RegisterFormValue): RegisterPayload {
  const studentNumber = form.studentNumber.trim();
  return {
    studentNumber,
    name: form.name.trim(),
    password: form.password,
    email: `${studentNumber}@zju.edu.cn`,
  };
}

export function buildRecoverStudentNumber(studentNumber: string): string {
  return studentNumber.trim();
}

export function buildResetPasswordPayload(token: string, password: string): {
  passwordResetToken: string;
  password: string;
} {
  return {
    passwordResetToken: token.trim(),
    password,
  };
}
