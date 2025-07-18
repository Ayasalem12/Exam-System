// import { User } from "./user.model";
// import { Exam } from "./exam.model";
export interface Question{
  _id?: string;
  examId?: string;
  questionDesc: string;
  choices: string[];
  answer: string ;
  score:number,
  createdAt?: string;
  updatedAt?: string;
}