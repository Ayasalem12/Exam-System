import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css'],
})
export class AddExamComponent {
  examForm: FormGroup;
  examData = {
    title: '',
    description: '',
    duration: 0,
    createdBy: '',
  };

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router,
    public authService: AuthService // Made public to access in template
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

  onSubmit() {
    if (this.examForm.valid) {
      const formValue = this.examForm.value;
      const finalExamData = {
        ...formValue,
        createdBy: this.examData.createdBy,
      };
      console.log(finalExamData);
      this.examService.addExam(finalExamData).subscribe({
        next: (response) => {
          this.router.navigate(['/exams']);
        },
        error: (error) => {
          if (error.status === 401 || error.status === 500) {
          }
        },
        complete: () => {
          console.log('Request completed');
        },
      });
    }
  }

  onCancel() {
    this.router.navigate(['/exams']);
  }
}
