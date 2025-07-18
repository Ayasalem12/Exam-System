import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get the current user's data
  getUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/me`);
  }

  // Update the current user's data (admin only)
  updateUser(data: { username: string; email: string }): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/user/update`, data);
  }

  // Get all users (admin only)
  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/getallusers`);
  }
}
