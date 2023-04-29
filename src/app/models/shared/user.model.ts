import { Groupe } from 'app/models/groupe.model';
import { Activitie } from 'app/models/Activitie.model';

export class User {
  userId: number;
  userNumber: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  activityId: number;
  qualification: number;
  groupId: number;
  rolesId: Array<string>;
  functionsId: Array<string>;
  hierarchicalHead1: number;
  hierarchicalHead2: number;
  hasSubordinates: boolean;
  picture: string = null;
 
  userPassword:string;

 
}


