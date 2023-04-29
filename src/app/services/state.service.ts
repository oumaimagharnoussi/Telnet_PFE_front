import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Etat } from 'app/models/Etat.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private baseUrl: string = "https://localhost:7250/api/Etat/"

  constructor(private http: HttpClient) { }

  getEtats(){
    return this.http.get<any>(this.baseUrl);
  }
  getEtatById(id: number): Observable<Etat>{
    return this.http.get<Etat>(`${this.baseUrl}${id}`);
  }
  getEtatsList(): Observable<Etat[]>{
    return this.http.get<Etat[]>(`${this.baseUrl}`);
  }

  createEtat(etat: Etat): Observable<Object>{
    return this.http.post(`${this.baseUrl}`, etat);
  }

  

  updateCommentaire(id: number, etat: Etat): Observable<Object>{
    return this.http.put(`${this.baseUrl}${id}`, etat);
  }
  
  
  
  deleteCommentaire(id: number): Observable<Object>{
    return this.http.delete(`${this.baseUrl}${id}`);
  }
}
