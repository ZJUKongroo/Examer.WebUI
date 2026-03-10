import type { User } from "./user";
import type { Exam, Problem } from "./exam";

export interface CommitFile {
  id: string;
  fileName: string;
  fileType: number;
  size?: number;
}

export interface Marking {
  id: string;
  commitId: string;
  reviewUserId: string;
  score: number;
  comment: string;
}

export interface Commit {
  id: string;
  description: string;
  commitTime: string;
  user: User;
  exam: Exam;
  problem: Problem;
  markings: Marking[];
  files: CommitFile[];
}
