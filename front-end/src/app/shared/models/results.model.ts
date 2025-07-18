export interface Result {
  _id: string;
  userId: { _id: string; username: string }; // Simplified to match populated fields
  examId: { _id: string; title?: string };
  answers: Answer[];
  score: number;
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Answer {
  questionId: {
    _id: string;
    questionDesc: string;
    answer: string; // Changed to string to match backend
  };
  userAnswer: string;
}