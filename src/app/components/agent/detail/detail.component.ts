import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from 'app/models/shared';
import { ActivitieService } from 'app/services/activitie.service';
import { ApiService } from 'app/services/api.service';
import { AuthService } from 'app/services/auth.service';
import { GroupService } from 'app/services/group.service';
import { NotificationService } from 'app/services/shared';
import { Groupe } from 'app/models/groupe.model';
import { Activitie } from 'app/models/Activitie.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  userId: number;
  user: User;
  selectedGroup: Groupe;
  selectedActivity: Activitie;

  constructor(private route: ActivatedRoute, private api: ApiService,private groupapi:GroupService,
    private act:ActivitieService) { }

    ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('userId');
  
    this.api.getUserById(userId).subscribe(user => {
      this.user = user;
      this.getGroupById(this.user.groupId);
      this.getActivityById(this.user.activityId);
    });
  }
  
  getGroupById(groupId: number) {
    this.groupapi.getGroupeById(groupId)
      .subscribe(group => this.selectedGroup = group);
  }
  
  getActivityById(activityId: number) {
    this.act.getActivitieById(activityId)
      .subscribe(activity => this.selectedActivity = activity);
  }
  
  
}