import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activitie } from 'app/models/Activitie.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitieService {
  private baseUrl: string = "https://localhost:7250/api/Activitie/"

  constructor(private http: HttpClient) { }

  getActivities(){
    return this.http.get<any>(this.baseUrl);
  }
  getActivitieById(activityId: number): Observable<Activitie>{
    return this.http.get<Activitie>(`${this.baseUrl}${activityId}`);
  }
  getActivitieList(): Observable<Activitie[]>{
    return this.http.get<Activitie[]>(`${this.baseUrl}`);
  }

  createActivitie(activitie: Activitie): Observable<Object>{
    return this.http.post(`${this.baseUrl}`, activitie);
  }

  

  updateActivitie(activityId: number, activitie: Activitie): Observable<Object>{
    return this.http.put(`${this.baseUrl}${activityId}`, activitie);
  }
  
  
  
  deleteActivitie(activityId: number): Observable<Object>{
    return this.http.delete(`${this.baseUrl}${activityId}`);
  }
}
