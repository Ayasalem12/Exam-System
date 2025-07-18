import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../core/services/exam.service';
import { Exam } from '../../shared/models/exam.model';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-exams',
  imports: [CommonModule, RouterLink],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit, OnDestroy {
  exams: Exam[] = [];
  errorMessage: string | null = null;
  private examSubscription: Subscription | undefined;
  private isLoading: boolean = false;
  private isInitialized: boolean = false;

  constructor(
    private examService: ExamService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.isInitialized) {
      this.loadExams();
      this.isInitialized = true;
    }
  }

  loadExams() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.exams = [];

    this.examSubscription = this.examService.getExams().subscribe({
      next: (response) => {
        const uniqueExams = this.removeDuplicates(response.data || [], 'title');
        this.exams = uniqueExams;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load projects: ' + (error.message || 'Unknown error');
        this.isLoading = false;
      },
    });
  }

  confirmDelete(examId: string) {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.deleteExam(examId);
    }
  }

  deleteExam(examId: string) {
    this.examService.deleteExam(examId).subscribe({
      next: () => {
        this.loadExams();
      },
      error: (error) => {
        this.errorMessage =
          'Failed to delete exam: ' + (error.message || 'Unknown error');
        console.error('Error deleting exam:', error);
      },
    });
  }

  private removeDuplicates(array: Exam[], key: keyof Exam): Exam[] {
    return [...new Map(array.map((item) => [item[key], item])).values()];
  }

  ngOnDestroy(): void {
    if (this.examSubscription) {
      this.examSubscription.unsubscribe();
    }
  }
}
