import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/models/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {

  private baseUrl: string = "https://localhost:7250/api/updateprofil/"

  constructor(private http: HttpClient) { }

  updateProfile(userId: number, user: User): Observable<Object>{
    return this.http.put(`${this.baseUrl}${userId}`, user);
  }
}
