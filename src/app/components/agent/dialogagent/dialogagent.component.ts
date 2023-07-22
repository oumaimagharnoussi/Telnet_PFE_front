import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivitieService } from 'app/services/activitie.service';
import { ApiService } from 'app/services/api.service';
import { GroupService } from 'app/services/group.service';
import { NotificationService } from 'app/services/shared';
import { SiteService } from 'app/services/site.service';

@Component({
  selector: 'app-dialogagent',
  templateUrl: './dialogagent.component.html',
  styleUrls: ['./dialogagent.component.scss']
})
export class DialogagentComponent implements OnInit {
  groups: any[] = [];
  selectedGroup: any;
  activities: any[] = [];
  site: any[] = [];
  selectedActivitie: any;
  selectedSite : any;
  productForm: FormGroup;
  actionBtn:string="Save";
  userId: number;
  
  constructor(private formBuilder: FormBuilder, private notificationService: NotificationService, private apisite:SiteService,
      @Inject(MAT_DIALOG_DATA) public editData:any, private apigroup:GroupService, private apiactivitie:ActivitieService,
      private api:ApiService, public dialog: MatDialogRef<DialogagentComponent>) { }
  
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      userNumber : ['', Validators.required],
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      userName : ['', Validators.required],
      email : ['', Validators.required],
      groupId: ['', Validators.required],
      activityId:['', Validators.required],
      telnetId:['', Validators.required]
    });
    
    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.patchValue({
        userNumber: this.editData.userNumber,
        firstName: this.editData.firstName,
        lastName: this.editData.lastName,
        userName: this.editData.userName,
        email: this.editData.email,
        groupId: this.editData.groupId,
        activityId: this.editData.activityId,
        telnetId: this.editData.telnetId
      });

      this.selectedGroup = this.groups.find(g => g.groupId === this.editData.groupId);
      this.selectedActivitie = this.activities.find(a => a.activityId === this.editData.activityId);
      this.selectedSite = this.site.find(s => s.telnetId === this.editData.telnetId);
    }

    this.apigroup.getGroupes().subscribe(
      data => {
        this.groups = data;
      },
      error => {
        console.log(error);
      }
    );
    this.apiactivitie.getActivities().subscribe(
      data => {
        this.activities = data;
      },
      error => {
        console.log(error);
      }
    );
    this.apisite.getSites().subscribe(
      data => {
        this.site = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  onGroupSelectionChange(event: any) {
    this.selectedGroup = this.groups.find(g => g.groupId === event.value);
  }

  onActivitieSelectionChange(event: any) {
    this.selectedActivitie = this.activities.find(a => a.activityId === event.value);
  }
  onSiteSelectionChange(event: any) {
    this.selectedSite = this.site.find(s => s.telnetId === event.value);
  }
  
    addGroup(){
      if(!this.editData){
        if(this.productForm.valid){
          this.api.createUser(this.productForm.value)
          .subscribe({
            next:(res)=>{
              this.notificationService.success("User added successfully");
              this.productForm.reset();
              this.dialog.close('save');
            },
            error:()=>{
              this.notificationService.danger("Error while adding the user")
            }
          })
        }
      }else{
        this.updategroup()
      }
    }
  
    updategroup(){
      this.api.updateUser(this.editData.userId, this.productForm.value)
  
      .subscribe({
        next:(res)=>{
          this.notificationService.success("User updated successfully");
          this.productForm.reset();
          this.dialog.close('update');
        },
        error:()=>{
          this.notificationService.danger("Error while updating the record!!");
        }
  
      })
    }
    close() {
      this.dialog.close();
    }
    cancel() {
      this.close();
    }
  }
  