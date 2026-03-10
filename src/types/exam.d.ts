import { ExamType } from "~/enums";

export interface Problem {
  id: string;
  name: string;
  description: string;
  problemType: number;
  score: number;
  completed?: boolean;
}

export interface Exam {
  name: string;
  id: string;
  examType: ExamType;
  startTime: string;
  endTime: string;
  problems: Problem[];
}
