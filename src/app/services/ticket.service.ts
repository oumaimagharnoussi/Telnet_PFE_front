import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commentaire } from 'app/models/Commentaire.model';
import { Ticket } from 'app/models/ticket.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl: string = "https://localhost:7250/api/Ticket/"
  constructor(private http: HttpClient) { }

  getTickets(){
    return this.http.get<any>(this.baseUrl);
  }
  getTicketById(ticketId: number): Observable<Ticket>{
    return this.http.get<Ticket>(`${this.baseUrl}${ticketId}`);
  }
  getCommentaires(ticketId: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}${ticketId}/commentaires`);
  }
  loadCommentaires(ticketId: number): Observable<Commentaire[]> {
    const url = this.baseUrl + ticketId + "/commentaires";
    return this.http.get<Commentaire[]>(url);
  }
  
  
  getTicketList(): Observable<Ticket[]>{
    return this.http.get<Ticket[]>(`${this.baseUrl}`);
  }

  createTicket(ticket: Ticket): Observable<Object>{
    return this.http.post(`${this.baseUrl}`, ticket);
  }
  
  updateTicket(ticketId: number, ticket: Ticket): Observable<Object>{
    return this.http.put(`${this.baseUrl}${ticketId}`, ticket);
  }
  
  
  
  deleteTicket(ticketId: number): Observable<Object>{
    return this.http.delete(`${this.baseUrl}${ticketId}`);
  }
}
