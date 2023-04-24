import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { NotificationService } from 'app/services/shared';
import { DialogComponent } from '../dialog.component';
import { GroupService } from 'app/services/group.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Groupe } from 'app/models/groupe.model';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  displayedColumns: string[] = ['name','action'];
  groupId: number;
  group: Groupe = new Groupe();

  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  dataSource : MatTableDataSource<any>;

  constructor(private dialog:MatDialog,private notificationService: NotificationService,private router: Router,
    @Inject(MAT_DIALOG_DATA) public data:any, private api:GroupService) { }

    applyFilter(event:Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter= filterValue.trim().toLowerCase();
     if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
     }
    }
  ngOnInit(): void {
    this.getAllTeams();
  }
openDialog(){
  this.dialog.open(DialogComponent,{
   width:'30%' 
  }).afterClosed().subscribe(val=>{
    if(val ==='save'){
      this.getAllTeams();
    }
  })
}
getAllTeams(){
  this.api.getGroupes()
  .subscribe({
    next:(res)=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator= this.paginator;
      this.dataSource.sort= this.sort
    },
    error:(err)=>{
      this.notificationService.danger("Error while fetching the Records !!");
    }
  })
}

editgroup(group:any){
this.dialog.open(DialogComponent,{
  width:'30%',
  data:group
}).afterClosed().subscribe(val=>{
  if(val==='update'){
    this.getAllTeams();
  }
})
}

deleteteam(groupId:number){
  this.api.deleteGroupe(groupId)
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

}
