import { UserRole } from "~/enums";

export interface LoginDto {
  studentNumber: string;
  password: string;
}

export interface LoginCredientialDto {
  token: string;
  expirationTime: string;
  role: UserRole;
  userId: string;
}

export interface RegisterDto {
  studentNo: string;
  name: string;
  college: string;
  major: string;
  class: string;
  phoneNo: string;
  password: string;
  seniorHigh?: string;
  dormitory?: string;
}
