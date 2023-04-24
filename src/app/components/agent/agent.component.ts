import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'app/models/shared';
import { ApiService } from 'app/services/api.service';
import { NotificationService } from 'app/services/shared';
import { DialogagentComponent } from './dialogagent/dialogagent.component';
import { GroupService } from 'app/services/group.service';
import { ActivitieService } from 'app/services/activitie.service';
import { Groupe } from 'app/models/groupe.model';
import { Activitie } from 'app/models/Activitie.model';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {

  displayedColumns: string[] = ['name','email','Activitie','Teams','action'];
  userId: number;
  user: User = new User();
  selectedGroup: Groupe;
  selectedActivitie: Activitie;
  activities: any[];
  groups: any[];
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  dataSource : MatTableDataSource<any>;

  constructor(private dialog:MatDialog,private notificationService: NotificationService,private router: Router,
    @Inject(MAT_DIALOG_DATA) public data:any, private api:ApiService,private groupapi:GroupService,
    private act:ActivitieService, private authservice:AuthService) { }

    applyFilter(event:Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter= filterValue.trim().toLowerCase();
     if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
     }
    }
  ngOnInit(): void {
    this.getAllTeams();
    
    const token = this.authservice.getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userGroupId = decodedToken.Groups;
    this.getGroupById(userGroupId);

    const userActivitieId = decodedToken.activitie;
    this. getActivitieById(userActivitieId);
  }
 

  getGroupById(groupId: number) {
    this.groupapi.getGroupeById(groupId)
      .subscribe(group => this.selectedGroup = group);
  }
  
  getActivitieById(activityId: number) {
    this.act.getActivitieById(activityId)
      .subscribe(activitie => this.selectedActivitie = activitie);
  }
openDialog(){
  this.dialog.open(DialogagentComponent,{
   width:'30%' 
  }).afterClosed().subscribe(val=>{
    if(val ==='save'){
      this.getAllTeams();
    }
  })
}
getAllTeams(){
  this.api.getUsers()
  .subscribe({
    next:(res)=>{
      // Modify the response to include group and activity information for each user
      res.forEach(user => {
        this.groupapi.getGroupeById(user.groupId).subscribe(group => {
          user.group = group.libelle;
        });
        this.act.getActivitieById(user.activityId).subscribe(activity => {
          user.activity = activity.libelle;
        });
      });
      
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator= this.paginator;
      this.dataSource.sort= this.sort
    },
    error:(err)=>{
      this.notificationService.danger("Error while fetching the Records !!");
    }
  })
}

editgroup(user:any){
this.dialog.open(DialogagentComponent,{
  width:'30%',
  data:user
}).afterClosed().subscribe(val=>{
  if(val==='update'){
    this.getAllTeams();
  }
})
}

deleteteam(userId:number){
  this.api.deleteUser(userId)
  .subscribe({
    next:(res)=>{
      this.notificationService.success("Team Delete Successfully");
      this.getAllTeams();
    },
    error:()=>{
      this.notificationService.danger("Error while deleting the team!!")
    }
  })

}


getAllActivities() {
  this.act.getActivities().subscribe({
    next: (res) => {
      this.activities = res;
    },
    error: (err) => {
      this.notificationService.danger('Error while fetching the Activities !!');
    },
  });
}

getAllGroups() {
  this.groupapi.getGroupes().subscribe({
    next: (res) => {
      this.groups = res;
    },
    error: (err) =>{
      this.notificationService.danger('Error while fetching the Activities !!');
    },
  });
}



userDetails(userId: number){
  this.router.navigate(['user-details', userId]);
}
}
