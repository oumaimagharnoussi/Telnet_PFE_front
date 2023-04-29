import { User } from "./shared";
import { Ticket } from "./ticket.model";
export class Commentaire {
  commentaireId: number;
  libelle: string;
  userId: number;
  user: User;
  ticketId: number;
  ticket: Ticket;
}
