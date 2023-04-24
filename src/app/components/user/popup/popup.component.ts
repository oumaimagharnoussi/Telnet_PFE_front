import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import * as alertify from 'alertifyjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { ActivatedRoute, Router } from '@angular/router';
import {Groups, User } from 'app/models/shared';

import { NotificationService } from 'app/services/shared/notification.service';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  user: User= new User();
  userId: number;
  group:Groups[];
  editdata: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  
  constructor( private notificationService: NotificationService,
    private router: Router,private route: ActivatedRoute, 
    private builder: FormBuilder, private dialog: MatDialog, private api: ApiService,
    @Inject(MAT_DIALOG_DATA ) public data:any) { }
    fileName=""
    image=""
    
  ngOnInit(): void {
    if (this.user.userId != null) {
      this.api.getUserById(this.user.userId).subscribe(response => {
        this.editdata = response;
        this.companyform.setValue({
          userNumber: this.editdata.userNumber, firstName: this.editdata.firstName, lastName: this.editdata.lastName,
          userName: this.editdata.userName, email: this.editdata.email,// picture: this.editdata.picture,
          
        });
      });
    }
    console.log(this.data);
  }

  companyform = this.builder.group({
    
    userNumber: this.builder.control('',Validators.required),
    firstName: this.builder.control('', Validators.required),
    lastName: this.builder.control('', Validators.required),
    userName: this.builder.control('', Validators.required),
    email: this.builder.control('', Validators.required),
    picture: this.builder.control('', Validators.required),
    
    
  });

  SaveUser() {
    if (this.companyform.valid) {
      const Editid = this.companyform.getRawValue().userId;
      if (Editid != '' && Editid != null) {
        this.api.updateUser(Editid, this.companyform.getRawValue()).subscribe(response => {
          this.closepopup();
          this.getAllUser();
       
          this.notificationService.success('updated successfully');
        });
      } else {
        this.api.createUser(this.companyform.value).subscribe(response => {
          this.closepopup();
          this.getAllUser()
          this.notificationService.success('saved successfully');

        });
      }
     
    }
  }
  getAllUser(){
    this.api.getUsers()
    .subscribe({
      next:(res)=>{
        console.log(res);
      },
      error:(err)=>{
        alert("Error while fetching the Records!!")
      }
    })
  }
  closepopup() {
    this.dialog.closeAll();
  }
/*selectImage(event:any){
    this.fileName = event.target.value
    this.companyform.get('picture').setValue(event.target.files[0])
    console.log(event)
}*/
fileChangeEvent(event: any): void {
  this.fileName = event.target.value
  this.imageChangedEvent = event;
}

imageCropped(event: ImageCroppedEvent) {
  //this.fileName = event.target.value
  this.croppedImage = event.base64;
}

selectImage() {
  
  const inputElement: HTMLInputElement = document.getElementById('imageInput') as HTMLInputElement;
  inputElement.click();
}


}