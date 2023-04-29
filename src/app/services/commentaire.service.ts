import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commentaire } from 'app/models/Commentaire.model';
@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  private baseUrl: string = "https://localhost:7250/api/Commentaire/"

  constructor(private http: HttpClient) { }

  getCommentaires(){
    return this.http.get<any>(this.baseUrl);
  }
  getCommentaireById(commentaireId: number): Observable<Commentaire>{
    return this.http.get<Commentaire>(`${this.baseUrl}${commentaireId}`);
  }
  getCommentairesList(): Observable<Commentaire[]>{
    return this.http.get<Commentaire[]>(`${this.baseUrl}`);
  }

  createCommentaire(commentaire: Commentaire): Observable<Object>{
    return this.http.post(`${this.baseUrl}`, commentaire);
  }

  

  updateCommentaire(commentaireId: number, commentaire: Commentaire): Observable<Object>{
    return this.http.put(`${this.baseUrl}${commentaireId}`, commentaire);
  }
  
  
  
  deleteCommentaire(commentaireId: number): Observable<Object>{
    return this.http.delete(`${this.baseUrl}${commentaireId}`);
  }
}
