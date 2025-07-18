import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    public authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{3,10}@(gmail|yahoo)\.com$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUser().subscribe({
      next: (response) => {
        const user = response.data;
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile';
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.error = '';
      const formValue = this.profileForm.value;
      this.userService.updateUser(formValue).subscribe({
        next: () => {
          this.router.navigate(['/exams']);
        },
        error: (err) => {
          this.error =
            err.error?.message ||
            (err.status === 403
              ? 'Only admins can update profiles'
              : 'Failed to update profile');
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/exams']);
  }
}
