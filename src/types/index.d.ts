export interface LoginDto {
  studentNo: string;
  password: string;
}
export interface option {
  target: string;
  title: string;
}
type Gender = "男" | "女";

export interface Profile {
  id: string;
  studentNo: string;
  name: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  id: string;
  name: string;
  identityNo: string;
  gender: Gender;
  phoneNumber: string;
  politicalAffiliation:
    | "中国共产党党员"
    | "中国共产党预备党员"
    | "中国共产主义青年团团员"
    | "中国国民党革命委员会会员"
    | "中国民主同盟盟员"
    | "中国民主建国会会员"
    | "中国民主促进会会员"
    | "中国农工民主党党员"
    | "中国致公党党员"
    | "九三学社社员"
    | "台湾民主自治同盟盟员"
    | "无党派民主人士"
    | "群众";
  ethnic: string;
  birthDate: string;
  major: string;
  partyAdmittedDate?: string;
  youthLeagueAdmittedDate?: string;
  dormitory: string;
  partyAdmitted: boolean;
  activistAdmitted: boolean;
  youthLeagueAdmitted: boolean;
}

import { UserRole } from "~/enums";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  studentNo: string;
  description: string;
  gender: number;
  ethnicGroup: number;
  dateOfBirth: string;
  phoneNo: string;
  college: string;
  major: string;
  class: string;
  campus: string;
  dormitory: string;
  politicalStatus: number;
  homeAddress: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  users: User[];
}

export interface _Class {
  id: string;
  name: string;
  users: Array<User>;
}

export interface Branch {
  id: string;
  name: string;
  classes: Array<_Class>;
}

export interface Community {
  id: string;
  name: string;
  grade: string;
  branches: Array<Branch>;
}

export type BrowseList = Array<Community>;

export interface Counsellor {
  name: string;
  identityNo: string;
  id: string;
}

export interface Problem {
  id: string;
  name: string;
  description: string;
  problemType: number;
  score: number;
  completed?: boolean;
}

import { ExamType } from "~/enums";

export interface Exam {
  name: string;
  id: string;
  examType: ExamType;
  startTime: string;
  endTime: string;
  problems: Problem[];
}

export interface Commit {
  id: string;
  description: string;
  commitTime: string;
  user: User;
  exam: Exam;
  problem: Problem;
  markings: Marking[];
  files:CommitFile[];
}

export interface CommitFile{
  id: string
  fileName: string
  fileType: number
  size?: number
}

export interface Marking {
  id: string
  commitId: string
  reviewUserId: string
  score: number
  comment: string
}

export interface Pagination { 
  totalCount: number, 
  pageSize: number, 
  currentPage: number, 
  totalPages: number, 
  previousPageLink: string, 
  nextPageLink: string
}
