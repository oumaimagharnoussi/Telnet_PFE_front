import { Component, OnInit, Input, OnDestroy, Injector, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DateTimeService, ExcelService, MailService, NotificationService, SearchFilterService, SortService } from 'app/services/shared';
import { WorkFromHomeRequest, WorkHomeRequestStatus, WorkHomeRequestStatusLabel } from 'app/models/human-resources/work-from-home';
import { Groups, HalfDay, Identifier, Type, User } from 'app/models/shared';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject, Subscription, forkJoin, of } from 'rxjs/index';
import { PaginatorPipe } from 'app/pipes/shared';
import { AuthService } from 'app/services/auth.service';
import { TicketService } from 'app/services/ticket.service';
import { Groupe } from 'app/models/groupe.model';
import { Activitie } from 'app/models/Activitie.model';
import { MatPaginator } from '@angular/material/paginator';
import { Ticket } from 'app/models/ticket.model';
import { StateService } from 'app/services/state.service';
import { ApiService } from 'app/services/api.service';
import { ActivitieService } from 'app/services/activitie.service';
import { switchMap, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Etat } from 'app/models/Etat.model';
import { GroupService } from 'app/services/group.service';
import { SiteService } from 'app/services/site.service';
import { AddTicketComponent } from '../ticket/add-ticket/add-ticket.component';
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit, OnDestroy {
 
  @Input() workFromHomeRequests: WorkFromHomeRequest[];
  displayedColumns = ['userNumber', 'userFullName', 'activityName', 'startDate', 'endDate', 'dayNumber','type',
    'site', 'state', 'buttons'];
    userId: number;
    user: User = new User();
    selectedGroup: Groupe;
    selectedActivitie: Activitie;
    activities: any[];
    filterValue: string;
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
 types:Type;
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
    private mailService: MailService,private apigroup:GroupService, private apisite:SiteService,
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


  //////////////////////
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
        const mappedResults = res.map((ticket) => {
          return this.apistate.getEtatById(ticket.id).pipe(
            switchMap((etat) => {
              ticket.etatLabel = etat.libelle;
  
              if (ticket.etat && ticket.etat.libelle === "Clos") {
                // Only process tickets with etat.libelle = "Clos"
  
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
  
                getUserById(ticket.userId).subscribe((user) => {
                  ticket.userUserNumber = user.userNumber;
                  ticket.username = user.firstName;
                  ticket.userfirstname = user.lastName;
  
                  getActivitieById(user.activityId).subscribe((activitie) => {
                    ticket.activityName = activitie.libelle;
                  });
                });
  
                const typeObject = this.type.find((obj) => obj.value === ticket.type);
  
                // Si l'objet de type est trouvé, attribuer la valeur du label à la propriété 'typeValue' du ticket
                if (typeObject) {
                  ticket.typeValue = typeObject.label;
                } else {
                  ticket.typeValue = ''; // Valeur par défaut si aucune correspondance n'est trouvée
                }
  
                const getSiteById = (telnetId) => {
                  return this.apisite.getSiteById(telnetId);
                };
  
                getSiteById(ticket.telnetId).subscribe((site) => {
                  ticket.siteLabel = site.libelle;
                });
  
                return ticket;
              } else {
                return null;
              }
            })
          );
        });
  
        forkJoin(mappedResults).subscribe((filteredResults) => {
          // Filter out null values
          const validResults = filteredResults.filter((result) => result !== null);
  
          this.dataSource = new MatTableDataSource(validResults);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        this.notificationService.danger("Error while fetching the records!!");
      }
    });
  }
  getEtatClass(etatLabel: string): string {
    if (etatLabel === 'Emis') {
      return 'gray-background';
    } else if (etatLabel === 'Pris en charge') {
      return 'green-background';
    } else if (etatLabel === 'Résolu') {
      return 'bleu-background';
    } else if (etatLabel === 'Clos') {
      return 'black-background';
    } else {
      return '';
    }
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
    



    type = [
      { value: Type.Assistance_diverse, label: 'Assistance diverse' },
      { value: Type.impression_locale, label: 'Impression locale' },
      { value: Type.impression_reseau, label: 'Impression reseau' },
      { value: Type.Droit_d_acces_initial, label: 'Droit d\'acces initial' },
      { value: Type.Droit_d_acces_changement, label: 'Droit d\'acces changement' },
      { value: Type.Droit_d_acces_revue, label: 'Droit d\'acces revue' }
    ];
    


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
      // Filter by ticket.username and ticket.userfirstname
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const usernameMatch = data.ticket.username.trim().toLowerCase().includes(filter);
        const userFirstNameMatch = data.ticket.userfirstname.trim().toLowerCase().includes(filter);
        return usernameMatch || userFirstNameMatch;
      };
    
      this.dataSource.filter = filterValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    
    applyFiltersite(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.siteLabel.trim().toLowerCase().indexOf(filter) !== -1;
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    applyFilterActivity(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
      // Filter by ticket.activityName
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.ticket.activityName.trim().toLowerCase().includes(filter);
      };
    
      this.dataSource.filter = filterValue;
    
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    
    applyFiltertype(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.typeValue.trim().toLowerCase().indexOf(filter) !== -1;
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
    
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      
    }
    
       
    
    applyFilterState(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.etatLabel.trim().toLowerCase().indexOf(filter) !== -1;
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    applyFilterDateRange() {
      this.dataSource.filterPredicate = (data: any) => {
        const startDate = new Date(this.fromDate);
        const endDate = new Date(this.toDate);
        const ticketStartDate = new Date(data.startDate);
        const ticketEndDate = new Date(data.endDate);
        return ticketStartDate >= startDate && ticketEndDate <= endDate;
      };
      this.dataSource.filter = 'applyFilter';
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    resetFilter() {
      this.fromDate = null;
      this.toDate = null;
      this.applyFilterDateRange();
      this.getAllTickets();
    }
     
    
}
