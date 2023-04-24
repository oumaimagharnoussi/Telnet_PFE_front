import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Groups, User } from 'app/models/shared';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  user: User= new User();
  userId: number;

  group:Groups[];
 
  ngForm:FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA ) public data:any,
    private apiService:ApiService,
    private router: Router,private fb:FormBuilder , private route: ActivatedRoute, public dialog: MatDialogRef<UpdateUserComponent> , public matDialog:MatDialog) { }

    ngOnInit(): void {
      console.log(this.data)
      this.userId = this.route.snapshot.params['userId'];
  
      this.apiService.getUserById(this.userId).subscribe(data => {
        this.user = data;
      }, error => console.log(error));
    }
  
    onSubmit(){
    
      this.apiService.updateUser(this.userId, this.user).subscribe( data =>{
        console.log(this.data)
        this.ngForm.reset();
        this.dialog.close();
        this.goToUserList();
        
      }
      , error => console.log(error));
    }
  
    goToUserList(){
      this.router.navigate(['/users']);
    }
}
