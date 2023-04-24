import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import ValidateForm from 'app/helpers/validateform';
import { Groups, User } from 'app/models/shared';
import { ApiService } from 'app/services/api.service';
import { NotificationService } from 'app/services/shared';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user: User= new User();
  group:Groups[];
  notificationService: NotificationService;
  ngForm:FormGroup;
  constructor(private apiService:ApiService,
    private router: Router,private fb:FormBuilder , public dialog: MatDialogRef<AddUserComponent> , public matDialog:MatDialog) { }
  fileName = ""
  ngOnInit(): void {
    this.createForm()
  }
  url="./assets/images/image-placeholder.png"
  createForm(){
    this.ngForm = this.fb.group({
      picture : ['', Validators.required]
    })
  }

  saveUser(){
    this.apiService.createUser(this.user).subscribe( data =>{
      console.log(data);
      this.notificationService.success('users add successfully');
      this.goToUserList();
    },
    error => console.log(error));
    this.notificationService.danger('erreur');
  }

  goToUserList(){
    this.router.navigate(['/users']);
  }
  
  onSubmit(){
    console.log(this.user);
    this.ngForm.reset();
    this.dialog.close();
    this.saveUser();
  }

 /* selectImage(event:any){
    this.fileName = event.target.value
    this.ngForm.get('picture').setValue(event.target.files[0])
    console.log(event)
  }*/

  selectImage(e, image:any){
    this.user.picture=image;
    this.fileName = e.target.value
    if(e.target.files){
      var reader = new FileReader();
      this.ngForm.get('picture');
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
  }

  

}
