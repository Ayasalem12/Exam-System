import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css'],
})
export class EditExamComponent implements OnInit {
  examForm: FormGroup;
  examId!: string;
  examData = {
    title: '',
    description: '',
    duration: 0,
    createdBy: '',
  };
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.examData.createdBy = userId;
    }

    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      duration: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id')!;

    if (!this.examId) {
      this.errorMessage = 'No exam ID provided';
      this.router.navigate(['/exams']);
      return;
    }

    this.examService.getExamById(this.examId).subscribe({
      next: (response) => {
        const exam = response.data;
        if (exam && typeof exam === 'object') {
          this.examForm.patchValue({
            title: exam.title || '',
            description: exam.description || '',
            duration: exam.duration || 0,
          });
          this.examData.createdBy = exam.createdBy || this.examData.createdBy;
        } else {
          this.errorMessage = 'exam data is not valid.';
          this.router.navigate(['/exams']);
        }
      },
      error: (err) => {
        this.errorMessage = 'failed to load exam. please try again.';
        this.router.navigate(['/exams']);
      },
    });
  }

  onSubmit() {
    if (this.examForm.valid) {
      const formValue = this.examForm.value;
      const finalExamData = {
        id: this.examId,
        ...formValue,
        createdBy: this.examData.createdBy,
      };

      this.examService.updateExam(finalExamData).subscribe({
        next: (response) => {
          this.router.navigate(['/exams']);
        },
        error: (error) => {
          this.errorMessage = 'failed to update exam. please try again.';
          if (error.status === 401 || error.status === 500) {
            console.log('Authentication or server error occurred');
          }
        },
        complete: () => {
          console.log('Update request completed');
        },
      });
    } else {
      console.log('Form is invalid:', this.examForm.errors);
      this.errorMessage = 'please fill all required fields.';
    }
  }

  onCancel() {
    this.router.navigate(['/exams']);
  }
}
