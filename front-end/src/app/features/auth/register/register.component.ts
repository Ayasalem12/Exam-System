import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  Validators,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{3,10}@(gmail|yahoo)\.com$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student'], // Default to 'student'
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          this.error =
            err.error?.message || 'Registration failed. Please try again.';
        },
        complete: () => {
          console.log('Registration successful');
        },
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
