import type { Commit, Marking, Problem } from "~/types";
import { get, post } from "~/api/http/request";
import {
  validateCommitId,
  validateCreateCommitPayload,
  validateCreateMarkingPayload,
} from "~/api/validation/commit.validation";

export interface CommitQuery {
  examId: string;
  problemId: string;
  userId: string;
}

export interface CreateCommitPayload {
  examId: string;
  problemId: string;
  userId: string;
}

export interface CreateMarkingPayload {
  commitId: string;
  reviewUserId: string;
  score: number;
  comment: string;
}

export function getCommitList(params: Partial<CommitQuery>) {
  return get<Commit[]>("/Commit", {
    params: {
      examId: params.examId?.trim(),
      problemId: params.problemId?.trim(),
      userId: params.userId?.trim(),
    },
  });
}

export function getCommitById(commitId: string) {
  return get<Commit>(`/commit/${validateCommitId(commitId)}`);
}

export function createCommit(payload: CreateCommitPayload) {
  return post<Commit, CreateCommitPayload>("/commit", validateCreateCommitPayload(payload));
}

export function confirmCommit(commitId: string) {
  return post<void>(`/commit/confirmation/${validateCommitId(commitId)}`);
}

export function createMarking(payload: CreateMarkingPayload) {
  return post<Marking, CreateMarkingPayload>("/marking", validateCreateMarkingPayload(payload));
}
