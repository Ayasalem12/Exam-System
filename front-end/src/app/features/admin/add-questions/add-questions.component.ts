import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuestionsService } from '../../../core/services/questions.service';
import { Question } from '../../../shared/models/question.model';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.css'],
})
export class AddQuestionsComponent {
  examId: string = '';
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
  ) {
    
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    this.question.examId = this.examId; 
  }

  // Add a new choice input field
  addChoice() {
    this.question.choices.push('');
  }

  // Remove a choice input field
  removeChoice(index: number) {
    if (this.question.choices.length > 1) {
      this.question.choices.splice(index, 1);
      
    }
  }

  updateAnswer(choice: string) {
      this.question.answer = choice; 
  }

  
  onSubmit() {
    if (
      !this.question.questionDesc ||
      this.question.choices.some((c) => !c) ||
      this.question.answer.length === 0 ||
      this.question.score <= 0 ||
      !this.question.examId 
    ) {
      this.errorMessage =
        'Please fill in all fields, select at least one correct answer, ensure the score is greater than 0, and verify the exam ID.';
      return;
    }
    this.question = {
      examId: this.question.examId,
      questionDesc: this.question.questionDesc,
      choices: this.question.choices,
      answer: this.question.answer, 
      score: this.question.score,
    };
    console.log('Submitting payload:', this.question);
    this.questionsService.createQuestions(this.examId, this.question).subscribe({
      next: (response) => {
        console.log("Response Question",response)
        this.successMessage = 'Question added successfully!';
        this.errorMessage = null;
        // Reset the form
        this.question = {
          _id:'',
          examId: this.examId,
          questionDesc: '',
          choices: ['', '', '', ''],
          answer:'',
          score: 1,
        };
      },
      error: (error) => {
        this.errorMessage = 'Failed to add question: ' + (error.message || 'Unknown error');
        this.successMessage = null;
        console.error('Error adding question:', error);
      },
    });
  }
}