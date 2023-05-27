import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { ApiService } from 'app/services/api.service';
import { UserStoreService } from 'app/services/user-store.service';
import { ActivitieService } from 'app/services/activitie.service';
import { Activitie } from 'app/models/Activitie.model';
import { Groupe } from 'app/models/groupe.model';
import { GroupService } from 'app/services/group.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('notificationBottom', [
      state('an-off, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('an-animate',
        style({
          overflow: 'hidden',
          height: AUTO_STYLE,
        })
      ),
      transition('an-off <=> an-animate', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('slideInOut', [
      state('in', style({
        width: '300px',
        // transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        width: '0',
        // transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('mobileHeaderNavRight', [
      state('nav-off, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('nav-on',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('nav-off <=> nav-on', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('mobileMenuTop', [
      state('no-block, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('yes-block',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('no-block <=> yes-block', [
        animate('400ms ease-in-out')
      ])
    ])
  ]
})

export class NavbarComponent implements OnInit {
  public users:any = [];
  public role!:string;
  public fullName : string = "";
  selectedActivitie: Activitie;
  imgUrl: string;
  public picture: string = null;
  public userName: string;
  public lastName: string;
  public Activitie:string;
  public groupId:number;
  selectedGroup: Groupe;
  constructor( private api : ApiService,private apigroup:GroupService,private act:ActivitieService, private userStore: UserStoreService, private router: Router,private auth: AuthService) { }

  ngOnInit(): void {
    this.api.getUsers()
    .subscribe(res=>{
      this.users = res;
    });
    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    })





    const token = this.auth.getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    this.userName = decodedToken.name;
    this.lastName=decodedToken.lastname;
    this.picture=decodedToken.pictureUrl;
    this.groupId = decodedToken.Groups;




    
      this.Activitie = decodedToken.activitie;
      

      const userGroupId = decodedToken.Groups;
      this.getGroupById(userGroupId);
  
      

      const userActivitieId = decodedToken.activitie;
      this. getActivitieById(userActivitieId);
  }
  getActivitieById(activityId: number) {
    this.act.getActivitieById(activityId)
      .subscribe(activitie => this.selectedActivitie = activitie);
  }
  getGroupById(groupId: number) {
    this.apigroup.getGroupeById(groupId)
      .subscribe(group => this.selectedGroup = group);
  }
  logout(){
    this.auth.signOut();
    
  }

}
