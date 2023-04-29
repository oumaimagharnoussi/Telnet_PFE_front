import { Ticket } from "./ticket.model";

export class Etat {
  id: number;
  libelle: string;
  ticket: Ticket[];
}
