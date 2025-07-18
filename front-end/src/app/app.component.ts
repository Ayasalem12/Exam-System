import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'exam-system';
  constructor(private authService: AuthService) {}
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
