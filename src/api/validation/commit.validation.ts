import type { CreateCommitPayload, CreateMarkingPayload } from "~/api/modules/commit.api";
import {
  assertFiniteNumber,
  assertNonEmptyString,
} from "~/api/validation/common";

export function validateCommitId(commitId: string): string {
  return assertNonEmptyString(commitId, "提交ID");
}

export function validateCreateCommitPayload(payload: CreateCommitPayload): CreateCommitPayload {
  return {
    examId: assertNonEmptyString(payload.examId, "考试ID"),
    problemId: assertNonEmptyString(payload.problemId, "题目ID"),
    userId: assertNonEmptyString(payload.userId, "用户ID"),
  };
}

export function validateCreateMarkingPayload(payload: CreateMarkingPayload): CreateMarkingPayload {
  const score = assertFiniteNumber(payload.score, "评分");
  if (score < 0) {
    throw new Error("评分不能小于0");
  }
  return {
    commitId: assertNonEmptyString(payload.commitId, "提交ID"),
    reviewUserId: assertNonEmptyString(payload.reviewUserId, "评审用户ID"),
    score,
    comment: payload.comment.trim(),
  };
}
