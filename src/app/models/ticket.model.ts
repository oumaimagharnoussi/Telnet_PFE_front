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
    Description: string;
    halfDay: HalfDay;
    userId: number;
    PrisEnChargePar:number;
    user: User;
    id: number;
    etat: Etat;
    dayNumber: number;
    file: string;
    commentaire: Commentaire[];
  }
  