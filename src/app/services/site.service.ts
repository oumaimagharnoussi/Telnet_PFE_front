import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site } from 'app/models/site.model';
@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private baseUrl: string = "https://localhost:7250/api/Telnet/"

  constructor(private http: HttpClient) { }

  getSites(){
    return this.http.get<any>(this.baseUrl);
  }
  getSiteById(telnetId: number): Observable<Site>{
    return this.http.get<Site>(`${this.baseUrl}${telnetId}`);
  }
  getSiteList(): Observable<Site[]>{
    return this.http.get<Site[]>(`${this.baseUrl}`);
  }

  createSite(telnet: Site): Observable<Object>{
    return this.http.post(`${this.baseUrl}`, telnet);
  }

  

  updateSite(telnetId: number, telnet: Site): Observable<Object>{
    return this.http.put(`${this.baseUrl}${telnetId}`, telnet);
  }
  
  
  
  deleteSite(telnetId: number): Observable<Object>{
    return this.http.delete(`${this.baseUrl}${telnetId}`);
  }
}

