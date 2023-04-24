import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Groups, User } from 'app/models/shared';
import { ApiService } from 'app/services/api.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import {ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users: User[];
  group: Groups[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private apiService:ApiService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsers();
   
  }

  private getUsers(){
    this.apiService.getUsers().subscribe(data=>{
      this.users = data;
    });
  }

  userDetails(userId: number){
    this.router.navigate(['user-details', userId]);
  }

  updateUser(userId: number){
    this.openDialoga();
  }

  deleteUser(userId: number){
    this.apiService.deleteUser(userId).subscribe( data => {
      console.log(data);
      this.getUsers();
    })
  }



  openDialog() {
    const dialogRef = this.dialog.open(AddUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openDialoga() {
    const dialogRef = this.dialog.open(UpdateUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
