import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Site } from './models/site.model';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private baseUrl: string = "https://localhost:7250/api/Site/"

  constructor(private http: HttpClient) { }

  getSites(){
    return this.http.get<any>(this.baseUrl);
  }
  getSiteById(userId: number): Observable<Site>{
    return this.http.get<Site>(`${this.baseUrl}${userId}`);
  }
}
