import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
// import { Result } from '../../shared/models/results.model';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/result/admin`);
  }
  getUserResults(userId:string|null|undefined): Observable<any> {
    return this.http.get(`${this.apiUrl}/result/student/${userId}`);
  }
}
