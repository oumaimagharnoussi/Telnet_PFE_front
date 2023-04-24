import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/models/shared';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId:number;
User : User;
  user= {
    
    userNumber: "",
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    qualification: "",
    picture:""
  };
 


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
    private route : ActivatedRoute,
    private auth:ApiService,
    private router: Router) { }

    ngOnInit() {
      this.userId = this.route.snapshot.params['userId'];

    this.auth.getUserById(this.userId).subscribe(data => {
      this.User = data;
    }, error => console.log(error));
      //console.log(this.data)
    }

    onSubmit(){
      this.auth.updateUser(this.userId, this.User).subscribe( data =>{
       
      }
      , error => console.log(error));
    }


}
