import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header/header.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HeaderComponent],
})
export class MainLayoutComponent {
  isSidebarCollapsed: boolean = false;
  userRole? :boolean;
  constructor(public authService: AuthService) {}
  isAdmin(){
    return this.userRole= this.authService.isAdmin()
  }
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  onLogOut() {
    this.authService.logout();
  }
}
