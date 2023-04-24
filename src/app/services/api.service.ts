import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/models/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = "https://localhost:7250/api/User/"

  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get<any>(this.baseUrl);
  }

  getUsersList(): Observable<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  createUser(user: User): Observable<Object>{
    return this.http.post(`${this.baseUrl}`, user);
  }

  getUserById(userId: number): Observable<User>{
    return this.http.get<User>(`${this.baseUrl}${userId}`);
  }

  updateUser(userId: number, user: User): Observable<Object>{
    return this.http.put(`${this.baseUrl}${userId}`, user);
  }

  deleteUser(userId: number): Observable<Object>{
    return this.http.delete(`${this.baseUrl}${userId}`);
  }



}