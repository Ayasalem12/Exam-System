import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { environment } from '../../enviroments/environment'; // Fixed typo: enviroments -> environments
import { Question } from '../../shared/models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Question APIs
  getAllQuestions(examId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/question/${examId}/allquestions`);
  }
  createQuestions(examId: string, question: Question): Observable<any> {
    return this.http.post(`${this.apiUrl}/question/${examId}/question`, question);
  }

  updateQuestion(examId: string, id: string, question:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/question/${examId}/question/${id}`, question);
  }


  deleteQuestion(examId: string, questionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/question/${examId}/question/${questionId}`);
  }
}
