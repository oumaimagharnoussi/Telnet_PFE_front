import { Commentaire } from "./Commentaire.model";
import { Etat } from "./Etat.model";
import { HalfDay } from "./human-resources/work-from-home";
import { Priorite, Type, User } from "./shared";

export class Ticket {
  ticketId: number;
  priorite: Priorite;
  type: Type;
  startDate: Date;
  endDate: Date;
  description: string;
  userId: number;
  prisEnChargePar: number;
  user: User;
  telnetId:number;
  id: number;
  etat: Etat;
  dayNumber: number;
  file: string;
  commentaire: Commentaire[];
 
  public halfDay = '';
  public halfDayLabel = ''; // new property to hold the label

  constructor() {
    // set default value for halfDayLabel in the constructor
    this.halfDayLabel = '';
  }
}
