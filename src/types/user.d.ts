import { Gender, UserRole } from "~/enums";

export interface UserDetailDto {
  userId: string;
  gender: Gender;
  ethnicGroup: number;
  dateOfBirth: string;
  phoneNumber: string;
  college: string;
  major: string;
  class: string;
  seniorHigh: string;
  dormitory: string;
  politicalStatus: number;
  homeAddress: string;
  englishLevel: string;
  gpaOfAllCourses: number;
  gpaOfMajorCourses: number;
  rank: number;
  collegeNumber: number;
  user?: User;
}

export interface AddUserDetailDto {
  gender: number;
  ethnicGroup: number;
  dateOfBirth: string;
  phoneNumber: string;
  college: string;
  major: string;
  class: string;
  seniorHigh: string;
  dormitory: string;
  politicalStatus: number;
  homeAddress: string;
  englishLevel: string;
  gpaOfAllCourses: number;
  gpaOfMajorCourses: number;
  rank: number;
  collegeNumber: number;
}

export interface User {
  id: string;
  name: string;
  studentNumber: string;
  email: string;
  role: UserRole;
  description: string;
  enabled: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  users: User[];
}

