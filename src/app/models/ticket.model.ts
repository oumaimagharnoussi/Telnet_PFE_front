import { Commentaire } from "./Commentaire.model";
import { Etat } from "./Etat.model";

import { HalfDay, Priorite, Type, User } from "./shared";

export class Ticket {
  ticketId: number;
  priorite: Priorite;
  type: Type;
  startDate: Date;
  endDate: Date;
  description: string;
  userId: number;
  user: User;
  telnetId:number;
  id: number; //id de class Etat
  etat: Etat;
  dayNumber: number;
  file: string;
  commentaires: Commentaire[];
  halfDay : HalfDay;
  prisEnChargeId: number | null;
  PrisEnCharge: User;
}
