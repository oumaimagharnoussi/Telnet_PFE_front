import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/models/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

  private baseUrl: string = "https://localhost:7250/api/ChangePassword/"
  
  constructor(private http: HttpClient) { }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const data = {
        userPassword: newPassword,
        currentPassword: currentPassword
    };
    return this.http.put<any>(`${this.baseUrl}${userId}`, data, httpOptions);
}

}
