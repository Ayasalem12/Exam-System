import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../../core/services/questions.service';
import { ExamService } from './../../../core/services/exam.service';
import { SubmitResponse } from '../../../shared/models/submit.model';
import { AuthService } from '../../../core/services/auth.service';
// import { Question } from '../../../shared/models/question.model';
// Define Question interface for type safety
interface Question {
  _id: string;
  questionDesc: string;
  choices: string[];
  score: number;
}

@Component({
  selector: 'app-take-exam',
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class TakeExamComponent implements OnInit {
  questions: Question[] = [];
  // answers: SubmitResponse[] = [];
  answers: SubmitResponse[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  examId: string | null = null;
  isSubmitting = false;
  userRole?: boolean;
  userId?: string  | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionsService: QuestionsService,
    private examService: ExamService,
    private authService:AuthService
  ) {}
  
  isAdmin(){
    return this.userRole= this.authService.isAdmin()
  }
  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.userId = this.authService.getUserId();
    if (this.examId) {
      console.log('Fetching questions for examId:', this.examId);
      this.questionsService.getAllQuestions(this.examId).subscribe({
        next: (questions) => {
          console.log('Questions received:', questions);
          this.questions = questions.data;
          // Initialize answers with questionId and empty answer
          this.answers = this.questions.map(q => ({ questionId: q._id, answer: '' }));
        },
        error: (err) => {
          console.error('Error fetching questions:', err);
          this.errorMessage = 'Error to load data';
        }
      });
    } else {
      console.log('No examId found in route');
      this.errorMessage = 'Exam not exists';
    }
  }

  

  onSubmit() {
    // Validate all questions are answered
    if (this.answers.some(answer => !answer.answer.trim())) {
      this.errorMessage = 'Must Answer All Questions';
      this.successMessage = null;
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    
    console.log('Payload being sent to backend:', { answers: this.answers });

    if (this.examId) {
      this.examService.submitAnswers(this.examId,this.userId,this.answers).subscribe({
        next: (response) => {
          console.log('Submission response:', response);
          const total = this.questions.reduce((sum, q) => sum + q.score, 0);
          const score = response.result?.score ?? 0;
          const examId = response.result?.examId ?? this.examId;
          this.router.navigate(['/results'], {
            queryParams: {
              score: score,
              total: total,
              message: response.message || 'Send Successfully',
              examId: examId,
              userId:this.userId
            }
          });
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error submitting answers:', err);
          this.errorMessage = err.error?.message || 'Error to send exam';
          this.successMessage = null;
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Error';
      this.successMessage = null;
      // this.isSubmitting = false;
    }
  }

  // Navigate to add question page for admin
  onAddQuestion() {
    if (this.examId) {
      this.router.navigate([`/exams/${this.examId}/createquestion`]);
    }
  }

  // Update a question
  updateQuestion(questionId: string) {
    if (this.examId) {
      this.router.navigate([`/exams/${this.examId}/question/${questionId}`]); // Adjust route as needed
    }
  }

  // Delete a question
  deleteQuestion(questionId: string) {
    if (this.examId && confirm('Are you sure you want to delete this question?')) {
      this.questionsService.deleteQuestion(this.examId, questionId).subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q._id !== questionId);
          this.answers = this.answers.filter(a => a.questionId !== questionId);
          this.successMessage = 'Question deleted successfully';
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('Error deleting question:', err);
          this.errorMessage = 'Error deleting question';
          this.successMessage = null;
        }
      });
    }
  }
}
