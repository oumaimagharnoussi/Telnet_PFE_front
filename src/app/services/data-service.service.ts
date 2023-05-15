import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl: string = "https://localhost:7250/api/User/"
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get('https://localhost:7250/api/User/');
  }

  getUsers(){
    return this.http.get<any>(this.baseUrl);
  }
}