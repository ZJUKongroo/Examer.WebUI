export interface ProblemPayloadInput {
  name: string;
  description: string;
  score: number | string;
}

export interface ProblemPayload {
  name: string;
  description: string;
  score: number;
}

export interface CreateProblemPayloadInput extends ProblemPayloadInput {
  examId: string;
  problemType: number;
}

export interface CreateProblemPayload extends ProblemPayload {
  examId: string;
  problemType: number;
}

export function buildProblemPayload(input: ProblemPayloadInput): ProblemPayload {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    score: Number(input.score),
  };
}

export function buildCreateProblemPayload(input: CreateProblemPayloadInput): CreateProblemPayload {
  return {
    ...buildProblemPayload(input),
    examId: input.examId.trim(),
    problemType: input.problemType,
  };
}
