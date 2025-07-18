import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResultsService } from '../../../core/services/results.service';
import { AuthService } from '../../../core/services/auth.service';
import { Result } from '../../../shared/models/results.model';

@Component({
  selector: 'app-result-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css'],
  standalone: true
})
export class ResultListComponent implements OnInit {
  results: Result[] = [];
  errorMessage: string | null = null;
  userRole?: boolean;
  userId?: string | null |undefined;
  expandedResultId: string | null = null;
  successMessage: string | null = null;

  constructor(
    private resultsService: ResultsService,
    private authService: AuthService
  ) {}

  isAdmin() {
    return this.userRole = this.authService.isAdmin();
  }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Please log in to view results.';
      return;
    }

    // Get user role and ID
    this.userRole = this.authService.isAdmin();
    this.userId = this.authService.getUserId();
    console.log("user id : ",this.userId)
    console.log("user role : ",this.userRole)

    if (!this.userId) {
      this.errorMessage = 'User ID not found. Please log in again.';
      return;
    }

    // Fetch results based on role
    if (this.userRole) {
      this.fetchAllResults();
    } else {
      this.fetchUserResults();
    }
  }

  fetchAllResults(): void {
    this.resultsService.getAllResults().subscribe({
      next: (results) => {
        console.log('All Results:', results);
        this.results = Array.isArray(results.data) ? results.data : [];
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load results: ' + (error.error?.message || error.message);
        console.error('Error fetching all results:', error);
      },
    });
  }

  fetchUserResults(): void {
    this.resultsService.getUserResults(this.userId).subscribe({
      next: (results) => {
        console.log('User Results:', results);
        this.results = Array.isArray(results.data) ? results.data : [];
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load your results: ' + (error.error?.message || error.message);
        console.error('Error fetching user results:', error);
      },
    });
  }

  toggleAnswers(resultId: string): void {
    this.expandedResultId = this.expandedResultId === resultId ? null : resultId;
  }
}