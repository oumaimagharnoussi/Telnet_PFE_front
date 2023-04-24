import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Groups, User } from 'app/models/shared';
import { PopupComponent } from '../popup/popup.component';
import * as alertify from 'alertifyjs'
import { ApiService } from '../../../services/api.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'app/services/shared';
import { AuthService } from 'app/services/auth.service';
import { UserStoreService } from 'app/services/user-store.service';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  searchTerm: string = '';
  public users:any = [];
  public fullName: string;
  public userName: string;
  public lastName: string;
  
  constructor(private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private builder: FormBuilder,private dialog: MatDialog, private api: ApiService,private router: Router,private route: ActivatedRoute,
    //dash
    private auth:AuthService, private userStore: UserStoreService
    ) { }
  @ViewChild(MatPaginator) _paginator!:MatPaginator;
  @ViewChild(MatSort) _sort!:MatSort;
  

  finaldata:any;
  userId: number;
  user: User = new User();
  
  ngOnInit(): void {
    console.log(this.data)
    this.LoadUser();
//dash
  /* this.api.getUsers()
    .subscribe(res=>{
      this.users =res;
    });
    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken
    })*/

    const token = this.auth.getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    this.userName = decodedToken.name;
    this.lastName=decodedToken.lastname;
  }
//dash
  logout(){
    this.auth.signOut();
  }

  displayColums: string[] = ["picture", "agent", "teams","action"]
  dataSource = new MatTableDataSource(this.data);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  Openpopup() {
    const dialogRef = this.dialog.open(PopupComponent,{
      width:'500px',
    });
     
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result == true){
      this.getAllUser();
      }
    });
  }

  getAllUser(){
    //this.router.navigate(['/users']);
    this.api.getUsers().subscribe((res:any)=>{
      this.data = this.mappingUsers(res.user)
    }, error=>{

    })
  }
  mappingUsers(data:any[]){
    let newUser = data.map(item=>{
      return {
        ...item,
        user:item.userId.userName
      }
    })
  }
  LoadUser() {
    this.api.getUsers().subscribe(response => {
      this.data = response;
      this.finaldata=new MatTableDataSource<User>(this.data);
      this.finaldata.paginator=this._paginator;
      this.finaldata.sort=this._sort;
    });
  }

  EditUser(user: any) {
    this.Openpopup();
    console.log(this.data)
    
  }

  
  RemoveUser(userId: number) {
    alert("do you want remove this user?")
    this.notificationService.success('User deleted successfully');
      this.api.deleteUser(userId).subscribe(r => {
        this.LoadUser();
      });
  
  }



  get filteredItems() {
    return this.data.filter(item => {
      const values = Object.values(item).join(' ').toLowerCase();
      return values.includes(this.searchTerm.toLowerCase());
    });
  }
  
}