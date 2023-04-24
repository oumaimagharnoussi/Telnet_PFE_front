import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Groupe } from 'app/models/groupe.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseUrl: string = "https://localhost:7250/api/Groupe/"

  constructor(private http: HttpClient) { }

  getGroupes(){
    return this.http.get<any>(this.baseUrl);
  }
  getGroupeById(groupId: number): Observable<Groupe>{
    return this.http.get<Groupe>(`${this.baseUrl}${groupId}`);
  }
  getGroupesList(): Observable<Groupe[]>{
    return this.http.get<Groupe[]>(`${this.baseUrl}`);
  }

  createGroupe(groupe: Groupe): Observable<Object>{
    return this.http.post(`${this.baseUrl}`, groupe);
  }

  

  updateGroupe(groupId: number, groupe: Groupe): Observable<Object>{
    return this.http.put(`${this.baseUrl}${groupId}`, groupe);
  }
  
  
  
  deleteGroupe(groupId: number): Observable<Object>{
    return this.http.delete(`${this.baseUrl}${groupId}`);
  }
}
