import type { Exam, User } from "~/types";
import { del, get, post, put } from "~/api/http/request";
import {
  validateExamId,
  validateMemberIds,
  validateProblemId,
  validateProblemPayload,
  validateSaveExamPayload,
} from "~/api/validation/exam.validation";

export interface SaveExamPayload {
  name: string;
  startTime: string;
  endTime: string;
  examType?: number;
}

export interface UpdateProblemPayload {
  name: string;
  description: string;
  score: number;
}

export interface CreateProblemPayload extends UpdateProblemPayload {
  examId: string;
  problemType: number;
}

export interface ExamUsersResponse {
  id: string;
  name: string;
  examType: number;
  startTime: string;
  endTime: string;
  users: string[];
}

export interface ExamGroupsResponse {
  id: string;
  name: string;
  examType: number;
  startTime: string;
  endTime: string;
  users: string[];
}

export function getExamList() {
  return get<Exam[]>("/Exam");
}

export function getExamById(examId: string) {
  return get<Exam>(`/Exam/${validateExamId(examId)}`);
}

export function createExam(payload: SaveExamPayload) {
  return post<Exam, SaveExamPayload>("/Exam", validateSaveExamPayload(payload));
}

export function updateExam(examId: string, payload: SaveExamPayload) {
  return put<void, SaveExamPayload>(`/Exam/${validateExamId(examId)}`, validateSaveExamPayload(payload));
}

export function deleteExam(examId: string) {
  return del<void>(`/Exam/${validateExamId(examId)}`);
}

export function assignExamMembers(examId: string, memberIds: string[]) {
  return post<void, string[]>(`/exam/assignment/${validateExamId(examId)}`, validateMemberIds(memberIds));
}

export function unassignExamMembers(examId: string, memberIds: string[]) {
  return del<void, string[]>(`/exam/assignment/${validateExamId(examId)}`, {
    data: validateMemberIds(memberIds),
  });
}

export function getExamUsers(examId: string) {
  return get<ExamUsersResponse>(`/exam/users/${validateExamId(examId)}`);
}

export function getExamGroups(examId: string) {
  return get<ExamGroupsResponse>(`/exam/groups/${validateExamId(examId)}`);
}

export function getUsers(params?: { pageNumber?: number; pageSize?: number }) {
  return get<User[]>("/user", {
    params:
      params
        ? {
            pagenumber: params.pageNumber,
            pagesize: params.pageSize,
          }
        : undefined,
  });
}

export function createProblem(payload: CreateProblemPayload) {
  const normalized = validateProblemPayload(payload);
  return post<void, CreateProblemPayload>("/Problem", {
    ...normalized,
    examId: validateExamId(payload.examId),
  });
}

export function updateProblem(problemId: string, payload: UpdateProblemPayload) {
  return put<void, UpdateProblemPayload>(
    `/Problem/${validateProblemId(problemId)}`,
    validateProblemPayload(payload)
  );
}

export function deleteProblem(problemId: string) {
  return del<void>(`/Problem/${validateProblemId(problemId)}`);
}
