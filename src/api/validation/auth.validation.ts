import type { LoginDto } from "~/types";
import type { RegisterPayload, ResetPasswordPayload } from "~/api/modules/auth.api";
import { assertNonEmptyString, assertRegex } from "~/api/validation/common";

const STUDENT_NUMBER_PATTERN = /^\d{10}$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z\s]).{8,}$/;
const NAME_PATTERN = /^[\u4e00-\u9fa5]{2,4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function assertPasswordComplexity(password: string): void {
  assertRegex(password, PASSWORD_PATTERN, "密码需包含大写字母、小写字母、数字和特殊字符，且不少于8位");
}

export function validateLoginPayload(payload: LoginDto): LoginDto {
  const studentNumber = validateStudentNumber(payload.studentNumber);
  const password = assertNonEmptyString(payload.password, "密码");
  return { studentNumber, password };
}

export function validateStudentNumber(studentNumber: string): string {
  const normalized = assertNonEmptyString(studentNumber, "学号");
  assertRegex(normalized, STUDENT_NUMBER_PATTERN, "学号需为10位数字");
  return normalized;
}

export function validateRegisterPayload(payload: RegisterPayload): RegisterPayload {
  const studentNumber = validateStudentNumber(payload.studentNumber);
  const name = assertNonEmptyString(payload.name, "姓名");
  const password = assertNonEmptyString(payload.password, "密码");
  const email = assertNonEmptyString(payload.email, "邮箱");

  assertRegex(name, NAME_PATTERN, "姓名需为2-4位中文字符");
  assertPasswordComplexity(password);
  assertRegex(email, EMAIL_PATTERN, "邮箱格式不正确");

  return { studentNumber, name, password, email };
}

export function validatePasswordResetToken(token: string): string {
  return assertNonEmptyString(token, "重置token");
}

export function validateResetPasswordPayload(payload: ResetPasswordPayload): ResetPasswordPayload {
  const passwordResetToken = validatePasswordResetToken(payload.passwordResetToken);
  const password = assertNonEmptyString(payload.password, "密码");
  assertPasswordComplexity(password);
  return { passwordResetToken, password };
}
