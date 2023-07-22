import { Component, Inject, OnInit,  ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Groupe } from 'app/models/groupe.model';
import { GroupService } from 'app/services/group.service';
import { WorkFromHomeRequest } from 'app/models/human-resources/work-from-home';
import { HalfDay, Identifier, Priorite, Type, User } from 'app/models/shared';
import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { DateTimeService, MailService, NotificationService } from 'app/services/shared';
import { ReplaySubject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from 'app/services/auth.service';
import { ApiService } from 'app/services/api.service';
import { TicketService } from 'app/services/ticket.service';
import { Ticket } from 'app/models/ticket.model';
import { Etat } from 'app/models/Etat.model';
import { StateService } from 'app/services/state.service';
import { forkJoin, Observable } from 'rxjs';

import { Site } from 'app/models/site.model';
import { SiteService } from 'app/services/site.service';
import { Commentaire } from 'app/models/Commentaire.model';
import { CommentaireService } from 'app/services/commentaire.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit {
 
  config: AngularEditorConfig = {
    /*editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    uploadUrl: '',*/

      editable: true,
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
 
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage']
      
    ]
   
  };
ticket:Ticket;
  filteredUsers: {userId: number, firstName: string, lastName: string}[] = [];
  selectedGroup: Groupe;
  userSearch = new FormControl('');
  user:User[];
  etat:Etat;
  userId:number;
  userGroup: string;
  public lastName: string;
  public firstName:string;
  public startDate:Date;
  public endDate: Date;
  selectedTicket: any;
  commentaires: Commentaire[];
 // halfDay: HalfDay;
 halfDay: HalfDay = HalfDay.AsSoonAsPossible;
  halefDayItems = Object.values(HalfDay); // Suppression de la méthode map car elle n'est pas nécessaire
//selectedHalefDayItem: HalfDay = this.halefDayItems[0];
//selectedTicket: Ticket;
//halfDay: HalfDay = null; // Initialisation à null pour éviter une erreur undefined
public isHalfDayChecked: boolean = false;

  groupId: number;
  groups: Groupe[];
  selectAllValue = 'selectAll';
  selectAllChecked = false;
  productForm: FormGroup;
  selectAllLabel = 'Select All';
 // halefDayItems = Object.values(HalfDay).map(key => HalfDay[key]);
 // selectedHalefDayItem: HalfDay = this.halefDayItems[0];
 // public isHalfDayChecked: boolean;
  workFromHomeRequest: WorkFromHomeRequest;
  dateTimeService: DateTimeService;
  isEdit = false;
  actionBtn:string="Save";
  supportGroupId: number;
 //public isHalfDayChecked = false;
 
  //isHalfDayChecked = false;
 // ticket = new Ticket();
  HalfDayValues = Object.values(HalfDay);
  etats: Etat[];
  sites:Site[];
  file: string;
  ticketId: number;
  selectedFile:Ticket;

URGENT_ICON_NAME = 'urgent.png';
URGENT_ICON_hight='Hight.png';
URGENT_ICON_Medium='Medium.png';
URGENT_ICON_low='low.png'
ticketComments: { [ticketId: number]: Commentaire[] } = {};

  workFromHomeRequestForm:FormGroup;
  supportUsers: any;
  constructor(private formBuilder: FormBuilder, private mailService: MailService,private apicommentaire:CommentaireService,private route: ActivatedRoute,
    private notificationService: NotificationService,private workFromHomeService: WorkFromHomeService,private dialogRef: MatDialogRef<AddTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public editData:any,private api:GroupService, private authservice:AuthService,private apiuser: ApiService,private http: HttpClient,
    public dialog: MatDialogRef<AddTicketComponent>,public apiTicket:TicketService, private apistate: StateService, private apiEtat:StateService,private apiSite:SiteService) {}

    ngOnInit(): void {
     // this.getCommentaires();
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
  
      this.apiTicket.getTicketById(this.ticketId).subscribe(ticket => this.ticket = ticket);
  
      this.productForm = this.formBuilder.group({
        userId: [this.userId, Validators.required],
        telnetId: ['', Validators.required],
        halfDay: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        priorite: ['', Validators.required],
        type: ['', Validators.required],
     //   prisEnChargeId: [''],
       // id: [''],
        description: [''],
        file: ['']
      //  commentaire: ['']
      });
  
      function processHalfDay(halfDay: HalfDay) {
        switch (halfDay) {
          case HalfDay.AsSoonAsPossible:
            console.log("As Soon As Possible");
            break;
          case HalfDay.InTheNextHour:
            console.log("In The Next Hour");
            break;
          // Ajoutez les autres cas ici
          default:
            console.log("Valeur non reconnue");
        }
      }
  
      processHalfDay(HalfDay.In1Day); // Affiche : "Dans 1 jour"
  
      this.apiEtat.getEtats().subscribe(data => {
        this.etats = data;
      });
      this.apiSite.getSites().subscribe(data => {
        this.sites = data;
      });
     
      
      if (this.editData) {
        this.actionBtn = "Update";
        this.productForm.patchValue({
          priorite: this.editData.priorite,
          type: this.editData.type,
          startDate: this.editData.startDate,
          endDate: this.editData.endDate,
          description: this.editData.description,
          halfDay: this.editData.halfDay,
          userId: this.editData.userId,
          prisEnChargeId: this.editData.prisEnChargeId,
          id: this.editData.id,
          dayNumber: this.editData.dayNumber,
          file: this.editData.file,
          commentaire: this.editData.commentaire,
          telnetId:this.editData.telnetId,
         
        });
        console.log(this.editData.ticketId);
    this.apiTicket.loadCommentaires(this.editData.ticketId).subscribe(
      (commentaires) => {
        // Filter commentaires based on editData.ticketId
        this.commentaires = commentaires.filter(
          (commentaire) => commentaire.ticketId === this.editData.ticketId
        );

        // Load user details for each commentaire
        this.loadUserDetailsForCommentaires(this.commentaires);
      },
      (error) => {
        console.log(error);
      }
    );
  }

    }

    loadUserDetailsForCommentaires(commentaires: Commentaire[]): void {
      const userRequests: Observable<User>[] = [];
    
      for (const commentaire of commentaires) {
        if (commentaire.userId) {
          const request = this.apiuser.getUserById(commentaire.userId);
          userRequests.push(request);
        }
      }
    
      forkJoin(userRequests).subscribe(
        (users) => {
          for (let i = 0; i < commentaires.length; i++) {
            commentaires[i].user = users[i];
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
    
    getUsersByGroupId(groupId: number) {
      this.apiuser.getUsers().subscribe(res => {
        this.user = res.filter(user => user.groupId === groupId);
        this.filteredUsers = this.user;
      });
    }
    getTicketWithComments(ticketId: number): void {
      this.apiTicket.getCommentaires(ticketId)
        .subscribe(ticket => this.ticket = ticket);
    }
    getFile(ticketId: number) {
      this.apiTicket.getTicketById(ticketId)
        .subscribe(ticket => this.selectedFile = ticket);
    }
  
   
  getGroupById(groupId: number) {
    this.api.getGroupeById(groupId)
      .subscribe(group => this.selectedGroup = group);
  }
  getFullName(): string {
    const token = this.authservice.getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const firstName = decodedToken.firstname;
    const lastName = decodedToken.lastname;

    return firstName + ' ' + lastName;
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
      this.ticket.halfDay = null; // Utilisation de null plutôt que '' pour éviter une erreur undefined
    } else {
      this.ticket.endDate = this.ticket.startDate;
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
    { value: Type.Diversified_aid, label: 'Diversified aid' },
    { value: Type.Local_printing, label: 'Local printing' },
    { value: Type.Network_printing, label: 'Network printing' },
    { value: Type.Initial_right_of_access, label: 'Initial right of access' },
    { value: Type.Right_of_access_change, label: 'Right of access change' },
    { value: Type.Right_of_access_reviewed, label: 'Right of access reviewed' }
  ];
  
  halfDays=[
    { value: HalfDay.AsSoonAsPossible, label: 'As Soon As Possible' },
    { value: HalfDay.InTheNextHour, label: 'In The Next Hour' },
    { value: HalfDay.InAHalfDay, label: 'In A Half Day' },
    { value: HalfDay.In1Day, label: 'In 1 DaY' },
    { value: HalfDay.In2Days, label: 'In 2 Days' },
    { value: HalfDay.InAWeek, label: 'In A Week' }
  ]
  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    // Filtrage des groupes
    const filteredGroups = this.groups.filter((group: Groupe) =>
        group.libelle.toLowerCase().includes(filterValue)
    );

    // Remplacement de la liste des groupes
    this.groups = filteredGroups;
}*/




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
  if(!this.editData){
    
    if(this.productForm.valid){
     // console.log(this.productForm.value)
      this.apiTicket.createTicket(this.productForm.value)
      .subscribe({
        next:(res)=>{
          //console.log("Next");
          this.notificationService.success("Ticket added successfully");
          this.productForm.reset();
          this.dialog.close('save');
        },
        error:()=>{
         
        /* console.log("ERROR");
         this.notificationService.danger("Error while adding the ticket")*/
         this.notificationService.success("Ticket added successfully");
          this.productForm.reset();
          this.dialog.close('save');
        }
      })
    }
  }else{
    this.updateticket()
  }
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
      this.notificationService.success("Ticket updated successfully");
      this.productForm.reset();
      this.dialog.close('update');
    }

  })
}


onFileChange(event) {
  const reader = new FileReader();

  if(event.target.files && event.target.files.length) {
    const [file] = event.target.files;
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.productForm.patchValue({
        File: reader.result
      });
    };
  }
}

fileName: string = '';
fileUrl: string;

onFileSelected(event) {
  const file = event.target.files[0];
  this.fileName = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    this.fileUrl = reader.result as string;
    this.productForm.controls['File'].setValue({
      filename: file.name,
      filetype: file.type,
      value: reader.result.toString().split(',')[1]
    });
  };
}
addComment() {
  const commentaire: Commentaire = {
    commentaireId: 0, // Valeur à attribuer en fonction de votre logique d'ID
    libelle: this.productForm.value.commentaire,
    userId: this.userId,
    user: null, // Remplir avec les données de l'utilisateur approprié
    ticketId: this.editData.ticketId,
    ticket: null, // Remplir avec les données du ticket approprié
    dateCreation: new Date()
  };

  this.apicommentaire.createCommentaire(commentaire).subscribe(
    (res) => {
      this.notificationService.success("The comment was created successfully");
      // Le commentaire a été créé avec succès
      this.commentaires.push(commentaire); // Ajoute le commentaire à la liste des commentaires
      this.productForm.get('commentaire').reset(); // Réinitialise le champ du commentaire
    },
    (error) => {
      this.notificationService.danger("Error !!");
      // Une erreur s'est produite lors de la création du commentaire
    }
  );
}
baseUrl: string = "https://localhost:7250/api/Commentaire/";
getCommentaires() {
  this.http.get<any>(this.baseUrl).subscribe(
    response => {
      this.commentaires = response;
    },
    error => {
      console.log(error);
    }
  );
}


Etats: any[] = [
  { id: 1, libelle: 'Emitted' },
  { id: 2, libelle: 'Supported' },
  { id: 3, libelle: 'Resolved' },
  { id: 4, libelle: 'Clos' }
];

myForm: FormGroup = new FormGroup({
  etat: new FormControl('')
});

get etatLabel(): string {
  return this.myForm.get('etat')?.value;
}
}
