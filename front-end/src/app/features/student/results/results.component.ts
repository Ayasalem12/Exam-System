import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exam-result',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ResultsComponent implements OnInit {
  score: number | null = null;
  total: number | null = null;
  message: string = 'Exam submitted successfully!';

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.score = params['score'] ? +params['score'] : null;
      this.total = params['total'] ? +params['total'] : null;
      if (params['message']) {
        this.message = params['message'];
      }
    });
  }
}