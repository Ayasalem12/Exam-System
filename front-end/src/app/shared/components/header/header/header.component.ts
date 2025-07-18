import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MainLayoutComponent } from '../../../../layout/main-layout/main-layout/main-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateToAddExam(event: Event) {
    event.preventDefault(); // Prevent any default Bootstrap behavior
    this.router.navigate(['/add-exam']);
  }

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout(); // Call the logout method from AuthService
  }
}
