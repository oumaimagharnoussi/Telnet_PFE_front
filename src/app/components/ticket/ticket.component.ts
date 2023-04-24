import { Component, OnInit, Input, OnDestroy, Injector, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { DateTimeService, ExcelService, MailService, NotificationService, SearchFilterService, SortService } from 'app/services/shared';
import { WorkFromHomeRequest, WorkHomeRequestStatus, WorkHomeRequestStatusLabel } from 'app/models/human-resources/work-from-home';
import { Groups, Identifier, User } from 'app/models/shared';
import swal from 'sweetalert2';
//import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { EditWorkFromHomeRequestComponent } from '../human-resources/work-from-home/work-from-home-request/edit-work-from-home-request/edit-work-from-home-request.component';
;
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs/index';

import { PaginatorPipe } from 'app/pipes/shared';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { AuthService } from 'app/services/auth.service';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnDestroy {
 
  @Input() workFromHomeRequests: WorkFromHomeRequest[];
  displayedColumns = ['userNumber', 'userFullName', 'activityName', 'startDate', 'endDate', 'dayNumber',
    'halfDay', 'state', 'buttons'];
  dataSource = new MatTableDataSource();
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
  forbiddenRejectValidate = true;
  listView = false;
  selectedWorkHomeRequestId: number;
  subscription: Subscription;
 // displayAddRequestComponentdialogRef: MatDialogRef<AddTicketComponent>;


  paginatorPipe: PaginatorPipe;
  dropdownSettings = {};
  dropdownSettingsStatus = {};
  resourceName: string;
  activitiesIdentifiers: Identifier[] = [];
  selectedActivitiesIds: string;
  selectedActivitiesIdentifiers: Identifier[] = [];
  statusIdentifiers: Identifier[] = [];
  selectedStatusesIdentifiers: Identifier[] = [];
  selectedStatusesIds: string;

  fromDate: Date;
  toDate: Date;
 
  lengthWorkFromHomeRequests: number;
  
  emptyResult: boolean;
  isLoading = false;

 
  refreshSubscription: Subscription;
  destroyed = new Subject();
  forbiddenActivityResource = true;
  onlyMySubordinates = true;


  
  sortService: SortService;
  
  excelService: ExcelService;
 
 
  constructor(private notificationService: NotificationService,private router: Router,private auth:AuthService,
    @Inject(MAT_DIALOG_DATA) public data:any,private dialog: MatDialog,
    private searchFilterService: SearchFilterService,
    //private workFromHomeService: WorkFromHomeService,
    private mailService: MailService,
    private dateTimeService: DateTimeService,
    injector: Injector) {
      this.dialog = injector.get<MatDialog>(MatDialog);
    }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    
  }

  openEditRequestDialog() {
    const dialogRef = this.dialog.open(AddTicketComponent,{
      width:'500px',
    });
  }
  getworkFromHomeLabel(state) {
    switch (state) {
      case WorkHomeRequestStatus.InProgress:
        return WorkHomeRequestStatusLabel.InProgress;
      case WorkHomeRequestStatus.Approved:
        return WorkHomeRequestStatusLabel.Approved;
      case WorkHomeRequestStatus.Rejected:
        return WorkHomeRequestStatusLabel.Rejected;
      default:
        return '';
    }
  }
  dateOnly(event): boolean {
    return this.dateTimeService.dateOnly(event);
  }
  onResetAllFilters() {
    sessionStorage.removeItem('workFromHomeSearch');
    const date = new Date();
    this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.resourceName = '';
    this.selectedStatusesIdentifiers = [];
    this.selectedActivitiesIdentifiers = [];
  }
}
