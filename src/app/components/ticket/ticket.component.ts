import { Component, OnInit, Input, OnDestroy, Injector, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { DateTimeService, ExcelService, MailService, NotificationService, SearchFilterService, SortService } from 'app/services/shared';
import { WorkFromHomeRequest, WorkHomeRequestStatus, WorkHomeRequestStatusLabel } from 'app/models/human-resources/work-from-home';
import { Groups, HalfDay, Identifier, User } from 'app/models/shared';

import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs/index';

import { PaginatorPipe } from 'app/pipes/shared';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { AuthService } from 'app/services/auth.service';
import { TicketService } from 'app/services/ticket.service';
import { Groupe } from 'app/models/groupe.model';
import { Activitie } from 'app/models/Activitie.model';
import { MatPaginator } from '@angular/material/paginator';
import { Ticket } from 'app/models/ticket.model';
import { StateService } from 'app/services/state.service';
import { ApiService } from 'app/services/api.service';
import { ActivitieService } from 'app/services/activitie.service';
import { tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Etat } from 'app/models/Etat.model';
import { GroupService } from 'app/services/group.service';



@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnDestroy {
 
  @Input() workFromHomeRequests: WorkFromHomeRequest[];
  displayedColumns = ['userNumber', 'userFullName', 'activityName', 'startDate', 'endDate', 'dayNumber',
    'halfDay', 'state', 'buttons'];
    userId: number;
    user: User = new User();
    selectedGroup: Groupe;
    selectedActivitie: Activitie;
    activities: any[];
   // groups: any[];
    ticket:Ticket;
    @ViewChild(MatPaginator) paginator:MatPaginator;
    @ViewChild(MatSort) sort:MatSort;
    productForm: FormGroup;
    dataSource : MatTableDataSource<any>;
    public isHalfDayChecked: boolean;
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
  forbiddenRejectValidate = true;
  listView = false;
  selectedWorkHomeRequestId: number;
  subscription: Subscription;
 // displayAddRequestComponentdialogRef: MatDialogRef<AddTicketComponent>;
 groupId: number;
 groups: Groupe[];

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
  etats: Etat[];
  
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
  activitie: Activitie;
 
  constructor(private notificationService: NotificationService,private router: Router,private auth:AuthService,
    @Inject(MAT_DIALOG_DATA) public data:any,private dialog: MatDialog,private apistate:StateService,
    private searchFilterService: SearchFilterService,private api:TicketService,private apiuser:ApiService,
    private apiactivitie:ActivitieService, private apiEtat:StateService,
    private mailService: MailService,private apigroup:GroupService,
    private dateTimeService: DateTimeService,private authservice:AuthService,
    injector: Injector) {
      this.dialog = injector.get<MatDialog>(MatDialog);
    }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.getAllTickets();

    this.apiEtat.getEtats().subscribe(data => {
      this.etats = data;
    });

    const token = this.authservice.getToken();
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
     
      this.groupId = decodedToken.Groups;
     
      this.userId = decodedToken.userId;
      const userGroupId = decodedToken.Groups;
      this.getGroupById(userGroupId);
  }
  getGroupById(groupId: number) {
    this.apigroup.getGroupeById(groupId)
      .subscribe(group => this.selectedGroup = group);
  }
  isEditDisabled(ticket: Ticket): boolean {
    const token = this.authservice.getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userGroupId = decodedToken.Groups;
    this.getGroupById(userGroupId);
  
    return ticket.etat.libelle !== 'Emis' || (this.selectedGroup && this.selectedGroup.libelle !== 'ressource');
  }
  
  openEditRequestDialog() {
    const dialogRef = this.dialog.open(AddTicketComponent,{
      width:'500px',
      height:'600px'
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
 
  
  getAllTickets() {
    this.api.getTickets().subscribe({
      next: (res) => {
        const users = {};
  
        const getUserById = (userId) => {
          if (users[userId]) {
            return of(users[userId]);
          }
  
          return this.apiuser.getUserById(userId).pipe(
            tap((user) => {
              users[userId] = user;
            })
          );
        };
  
        const getActivitieById = (activityId) => {
          return this.apiactivitie.getActivitieById(activityId);
        };
  
        const mappedResults = res.map((ticket) => {
          this.apistate.getEtatById(ticket.id).subscribe((etat) => {
            ticket.etatLabel = etat.libelle;
          });
  
          getUserById(ticket.userId).subscribe((user) => {
            ticket.userUserNumber = user.userNumber;
            ticket.username = user.firstName;
            ticket.userfirstname = user.lastName;
  
            getActivitieById(user.activityId).subscribe((activitie) => {
              ticket.activityName = activitie.libelle;
            });
          });
  
          // set the label for halfDay
          if (ticket.halfDay === 1) {
            ticket.halfDayLabel = HalfDay.Morning;
          } else if (ticket.halfDay === 2) {
            ticket.halfDayLabel = HalfDay.Afternoon;
          } else {
            ticket.halfDayLabel = '';
          }
  
          return ticket;
        });
  
        this.dataSource = new MatTableDataSource(mappedResults);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.notificationService.danger("Error while fetching the records!!");
      }
    });
  }
  editticket(ticket:any){
    this.dialog.open(AddTicketComponent,{
      width:'500px',
      height:'600px',
      data:ticket
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllTickets();
      }
    })
    } 

    deleteticket(ticketId:number){
      this.api.deleteTicket(ticketId)
      .subscribe({
        next:(res)=>{
          this.notificationService.success("Ticket Delete Successfully");
          this.getAllTickets();
        },
        error:()=>{
          this.notificationService.danger("Error while deleting the ticket !!")
        }
      })
    
    }

}
