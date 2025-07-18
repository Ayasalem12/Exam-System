import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuestionsService } from '../../../core/services/questions.service';
import { Question } from '../../../shared/models/question.model';

@Component({
  selector: 'app-edit-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css'],
})
export class EditQuestionComponent implements OnInit {
  examId: string = '';
  questionId: string = '';
  question: Question = {
    _id:'',
    examId: '',
    questionDesc: '',
    choices: ['', '', '', ''],
    answer: '',
    score: 1,
  };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionsService: QuestionsService
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    console.log("exam Id ",this.examId)
    this.questionId = this.route.snapshot.paramMap.get('id') || '';
    this.question.examId = this.examId;
    if (this.questionId && this.examId) {
      this.questionsService.getAllQuestions(this.examId).subscribe({
        next: (response) => {
          const question = response.data.find((q: Question) => q._id === this.questionId);
          if (question) {
            this.question = { ...question };
          } else {
            this.errorMessage = 'Question not found';
          }
        },
        error: (err) => {
          console.error('Error fetching question:', err);
          this.errorMessage = 'Error loading question data';
        },
      });
    } else {
      this.errorMessage = 'Invalid exam or question ID';
    }
  }

  // Add a new choice input field
  addChoice() {
    this.question.choices.push('');
  }

  // Remove a choice input field
  removeChoice(index: number) {
    if (this.question.choices.length > 1) {
      this.question.choices.splice(index, 1);
      if (!this.question.choices.includes(this.question.answer)) {
        this.question.answer = '';
      }
    }
  }

  // Update the selected answer
  updateAnswer(choice: string) {
    this.question.answer = choice;
  }

  // Submit the form to update the question
  onSubmit() {
    if (
      !this.question.questionDesc ||
      this.question.choices.some((c) => !c) ||
      !this.question.answer ||
      this.question.score <= 0 ||
      !this.examId
    ) {
      this.errorMessage =
        'Please fill in all fields, select a correct answer, ensure the score is greater than 0, and verify the exam ID.';
      return;
    }
  
    // إنشاء object يحتوي على الحقول المطلوبة فقط
    const payload = {
      questionDesc: this.question.questionDesc,
      choices: this.question.choices.filter((c) => c),  
      answer: this.question.answer,
      score: this.question.score,
    };
  
    console.log('Submitting payload:', payload);
    this.questionsService.updateQuestion(this.examId, this.questionId, payload).subscribe({
      next: (response) => {
        this.successMessage = 'Question updated successfully!';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate([`/exams/${this.examId}/allquestions`]), 2000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update question: ' + (error.error?.message || 'Unknown error');
        this.successMessage = null;
        console.error('Error updating question:', error);
      },
    });
  }
}
