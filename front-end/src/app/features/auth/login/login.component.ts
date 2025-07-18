import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';
  private isNavigating: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{3,10}@(gmail|yahoo)\.com$/),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loginForm.reset();
    this.error = '';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation to:', event.url);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isNavigating) {
      this.isNavigating = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/result-list']).then(() => {
            this.isNavigating = false;
          });
        },
        error: (err) => {
          this.isNavigating = false;
          const errorMessage = err.error?.message || '';

          if (errorMessage.toLowerCase().includes('user not found')) {
            alert('User not found. Redirecting to sign up.');
            this.router.navigate(['/signup']);
          } else {
            this.error = errorMessage || 'Login failed. Please try again.';
          }
        },
        complete: () => {
          console.log('Login successful');
        },
      });
    }
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
