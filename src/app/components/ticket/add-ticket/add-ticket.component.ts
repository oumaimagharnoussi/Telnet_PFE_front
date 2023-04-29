import { Component, Inject, OnInit,  ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Groupe } from 'app/models/groupe.model';
import { GroupService } from 'app/services/group.service';
import { HalfDay, WorkFromHomeRequest } from 'app/models/human-resources/work-from-home';
import { Identifier, Priorite, Type, User } from 'app/models/shared';
import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { DateTimeService, MailService, NotificationService } from 'app/services/shared';
import { ReplaySubject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from 'app/services/auth.service';
import { ApiService } from 'app/services/api.service';
import { TicketService } from 'app/services/ticket.service';
import { Ticket } from 'app/models/ticket.model';
@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit {
  selectedFile: File = null;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
      /* editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    /*uploadUrl: 'v1/image',
    upload: (file: File) => { ... }
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]*/
   
  };
  filteredUsers: {userId: number, firstName: string, lastName: string}[] = [];
  selectedGroup: Groupe;
  userSearch = new FormControl('');
  user:User[];
  userId:number;
  userGroup: string;
  public lastName: string;
  public firstName:string;
  public startDate:Date;
  public endDate: Date;
  groupId: number;
  groups: Groupe[];
  selectAllValue = 'selectAll';
  selectAllChecked = false;
  productForm: FormGroup;
  selectAllLabel = 'Select All';
  
  public isHalfDayChecked: boolean;
  workFromHomeRequest: WorkFromHomeRequest;
  dateTimeService: DateTimeService;
  isEdit = false;
  halefDayItems = Object.values(HalfDay).map(key => HalfDay[key]);
  selectedHalefDayItem: HalfDay = this.halefDayItems[0];
  
  actionBtn:string="Save";
  supportGroupId: number;
  ticket:Ticket;
  
URGENT_ICON_NAME = 'urgent.png';
URGENT_ICON_hight='Hight.png';
URGENT_ICON_Medium='Medium.png';
URGENT_ICON_low='low.png'

  workFromHomeRequestForm:FormGroup;
  supportUsers: any;
  constructor(private formBuilder: FormBuilder, private mailService: MailService,
    private notificationService: NotificationService,private workFromHomeService: WorkFromHomeService,private dialogRef: MatDialogRef<AddTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public editData:any,private api:GroupService, private authservice:AuthService,private apiuser: ApiService,public dialog: MatDialogRef<AddTicketComponent>,public apiTicket:TicketService) { }

    ngOnInit(): void {
      this.api.getGroupes().subscribe((data: Groupe[]) => {
        this.groups = data;
        const supportGroup = data.find(group => group.libelle === 'Support');
        if (supportGroup) {
          this.supportGroupId = supportGroup.groupId;
          this.getUsersByGroupId(this.supportGroupId);
        }
      });
  
      const token = this.authservice.getToken();
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      this.firstName = decodedToken.firstname;
      this.lastName = decodedToken.lastname;
      this.groupId = decodedToken.Groups;
     
      this.userId = decodedToken.userId;
      const userGroupId = decodedToken.Groups;
      this.getGroupById(userGroupId);
  
      this.apiuser.getUsers().subscribe(res => {
        this.user = res;
        this.filteredUsers = res;
      });
      this.userSearch.valueChanges.subscribe(searchValue => {
        this.filteredUsers = this.user.filter(user => {
          const fullName = user.firstName + ' ' + user.lastName;
          return fullName.toLowerCase().includes(searchValue.toLowerCase());
        });
      });



      this.productForm = this.formBuilder.group({
       // PrisEnChargePar:['', Validators.required],
       userId:[this.userId, Validators.required],

        startDate : ['', Validators.required],
        endDate : ['', Validators.required],
        priorite : ['', Validators.required],
        type : ['', Validators.required],
        Description : ['', Validators.required],
       /* halfDay: ['', Validators.required],
       
       
        id:['', Validators.required],
        dayNumber:['', Validators.required],
        file:['', Validators.required],
        commentaire:['', Validators.required]*/
      });
      
     /* if (this.editData) {
        this.actionBtn = "Update";
        this.productForm.patchValue({
          priorite: this.editData.priorite,
          type: this.editData.type,
          startDate: this.editData.startDate,
          endDate: this.editData.endDate,
          description: this.editData.description,
          halfDay: this.editData.halfDay,
          userId: this.editData.userId,
          PrisEnChargePar: this.editData.PrisEnChargePar,
          id: this.editData.id,
          dayNumber: this.editData.dayNumber,
          file: this.editData.file,
          commentaire: this.editData.commentaire
        });
      }*/
    }
  
    getUsersByGroupId(groupId: number) {
      this.apiuser.getUsers().subscribe(res => {
        this.user = res.filter(user => user.groupId === groupId);
        this.filteredUsers = this.user;
      });
    }
  
  

 
  
  getGroupById(groupId: number) {
    this.api.getGroupeById(groupId)
      .subscribe(group => this.selectedGroup = group);
  }

  close() {
    this.dialogRef.close();
  }
  cancel() {
    this.close();
  }
  dateOnly(event): boolean {
    return this.dateTimeService.dateOnly(event);
  }
  OnChangeHalfDay() {
    if (!this.isHalfDayChecked) {
      this.workFromHomeRequest.halfDay = null;
    } else {
      this.workFromHomeRequest.endDate = this.workFromHomeRequest.startDate;
    }
  }
  onChangingDate() {
    if (this.isHalfDayChecked) {
      this.ticket.endDate = this.ticket.startDate;
    } else {
      if (!this.ticket.endDate || this.ticket.startDate > this.ticket.endDate) {
        this.ticket.endDate = this.ticket.startDate;
      }
    }
  }


 
  calculateBetweenDates() {
    let dayNumber = 0;
    if (this.isHalfDayChecked) {
      dayNumber = 0.5;
    } else {
      const date1 = new Date(this.ticket.startDate);
      const date2 = new Date(this.ticket.endDate);
      const Difference_In_Time = date2.getTime() - date1.getTime();
      dayNumber = Difference_In_Time / (1000 * 3600 * 24) + 1;
    }
    console.log(dayNumber);
    return dayNumber;
  }
 
  
  priorites = [
    { value: Priorite.Urgent, label: 'Urgent', icon: this.URGENT_ICON_NAME },
   // { value: Priorite.Hight, label: 'Hight', icon: this.URGENT_ICON_hight },
    { value: Priorite.Medium, label: 'Medium' , icon: this.URGENT_ICON_Medium},
    { value: Priorite.Low, label: 'Low', icon: this.URGENT_ICON_low }
  ];
  types = [
    { value: Type.Assistance_diverse, label: 'Assistance diverse' },
    { value: Type.impression_locale, label: 'Impression locale' },
    { value: Type.impression_reseau, label: 'Impression reseau' },
    { value: Type.Droit_d_acces_initial, label: 'Droit dacces initial' },
    { value: Type.Droit_d_acces_changement, label: 'Droit dacces changement' },
    { value: Type.Droit_d_acces_revue, label: 'Droit dacces revue' }
  ];

  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    // Filtrage des groupes
    const filteredGroups = this.groups.filter((group: Groupe) =>
        group.libelle.toLowerCase().includes(filterValue)
    );

    // Remplacement de la liste des groupes
    this.groups = filteredGroups;
}*/


onFileSelected(event) {
  this.selectedFile = event.target.files[0];
}

isChecked(userId: number): boolean {
  return this.productForm.value.selectedUsers.includes(userId);
}

toggleSelectAll(): void {
  if (this.selectAllChecked) {
    // uncheck all checkboxes
    this.productForm.patchValue({ selectedUsers: [] });
  } else {
    // check all checkboxes
    const allUserIds = this.user.map(user => user.userId);
    this.productForm.patchValue({ selectedUsers: allUserIds });
  }
  this.selectAllChecked = !this.selectAllChecked;
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

  // Filter users by first and last name
  const filteredUsers = this.user.filter((user: { userId: number, firstName: string, lastName: string }) =>
    user.firstName.toLowerCase().includes(filterValue) ||
    user.lastName.toLowerCase().includes(filterValue)
  );

  // Update the list of filtered users
  this.filteredUsers = filteredUsers;
}
addTicket(){
 // console.log(this.productForm.value);
 // if(!this.editData){
    if(this.productForm.valid){
      this.apiTicket.createTicket(this.productForm.value)
      .subscribe({
        next:(res)=>{
          this.notificationService.success("Ticket added successfully");
          //this.productForm.reset();
          //this.dialog.close('save');
        },
        error:()=>{
          this.notificationService.danger("Error while adding the ticket")
        }
      })
    }
  //}else{
  //  this.updateticket()
 // }*/
}
updateticket(){
  this.apiTicket.updateTicket(this.editData.ticketId, this.productForm.value)

  .subscribe({
    next:(res)=>{
      this.notificationService.success("Ticket updated successfully");
      this.productForm.reset();
      this.dialog.close('update');
    },
    error:()=>{
      this.notificationService.danger("Error while updating the record!!");
    }

  })
}
}
