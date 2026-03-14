import type { SaveExamPayload } from "~/api/modules/exam.api";
import {
  assertDateOrder,
  assertFiniteNumber,
  assertNonEmptyString,
  assertStringArray,
} from "~/api/validation/common";

export function validateExamId(examId: string): string {
  return assertNonEmptyString(examId, "考试ID");
}

export function validateSaveExamPayload(payload: SaveExamPayload): SaveExamPayload {
  const name = assertNonEmptyString(payload.name, "考试名称");
  const startTime = assertNonEmptyString(payload.startTime, "开始时间");
  const endTime = assertNonEmptyString(payload.endTime, "结束时间");
  assertDateOrder(startTime, endTime);
  return {
    ...payload,
    name,
    startTime,
    endTime,
  };
}

export function validateMemberIds(memberIds: string[]): string[] {
  return assertStringArray(memberIds, "成员ID列表");
}

export function validateProblemId(problemId: string): string {
  return assertNonEmptyString(problemId, "题目ID");
}

export function validateProblemPayload<T extends { name: string; description: string; score: number }>(
  payload: T
): T {
  const name = assertNonEmptyString(payload.name, "题目名称");
  const description = assertNonEmptyString(payload.description, "题目描述");
  const score = assertFiniteNumber(Number(payload.score), "题目分数");
  if (score <= 0) {
    throw new Error("题目分数需为大于0的数字");
  }
  return {
    ...payload,
    name,
    description,
    score,
  };
}
