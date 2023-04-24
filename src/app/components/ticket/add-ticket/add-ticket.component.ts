import { Component, Inject, OnInit,  ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Groupe } from 'app/models/groupe.model';
import { GroupService } from 'app/services/group.service';
import { HalfDay, WorkFromHomeRequest } from 'app/models/human-resources/work-from-home';
import { Identifier, Priorite, Type } from 'app/models/shared';
import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { DateTimeService, MailService, NotificationService } from 'app/services/shared';
import { ReplaySubject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
  groupId: number;
  groups: Groupe[];
  initialWorkFromHomeRequest: WorkFromHomeRequest = new WorkFromHomeRequest();
  //@ViewChild('workFromHomeRequestForm', { static: true }) workFromHomeRequestForm: NgForm;
  public filteredResources: ReplaySubject<Identifier[]> = new ReplaySubject<Identifier[]>(1);
  public resourceFilterCtrl: FormControl = new FormControl();
  public isHalfDayChecked: boolean;
  workFromHomeRequest: WorkFromHomeRequest;
  dateTimeService: DateTimeService;
  isEdit = false;
  halefDayItems = Object.values(HalfDay).map(key => HalfDay[key]);
  selectedHalefDayItem: HalfDay = this.halefDayItems[0];
  errorMessage: string;
  resourcesIdentifiers: Identifier[];
  workFromHomeRequestId: number;

 
  
URGENT_ICON_NAME = 'urgent.png';
URGENT_ICON_hight='Hight.png';
URGENT_ICON_Medium='Medium.png';
URGENT_ICON_low='low.png'

  workFromHomeRequestForm:FormGroup;
  constructor(private formBuilder: FormBuilder, private mailService: MailService,
    private notificationService: NotificationService,private workFromHomeService: WorkFromHomeService,private dialogRef: MatDialogRef<AddTicketComponent>,
    @Inject(MAT_DIALOG_DATA) private data,private api:GroupService) { }

  ngOnInit(): void {
    this.api.getGroupes().subscribe((data: Groupe[]) => {
      this.groups = data;
    });
   this.workFromHomeRequestForm=this.formBuilder.group({
    
   }) 
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
      this.workFromHomeRequest.endDate = this.workFromHomeRequest.startDate;
    } else {
      if (!this.workFromHomeRequest.endDate || this.workFromHomeRequest.startDate > this.workFromHomeRequest.endDate) {
        this.workFromHomeRequest.endDate = this.workFromHomeRequest.startDate;
      }
    }
  }


  formControl() {
    this.errorMessage = '';
    let isValid = true;
    if (this.workFromHomeRequest.startDate > this.workFromHomeRequest.endDate) {
      this.errorMessage = 'End Date must be greater than Start Date.';
      isValid = false;
    }
    if (this.isHalfDayChecked && (this.workFromHomeRequest.halfDay === '' || this.workFromHomeRequest.halfDay === null)) {
      this.errorMessage = 'Day Time is required';
      isValid = false;
    }
    return isValid;
  }
  calculateBetweenDates() {
    let dayNumber = 0;
    if (this.isHalfDayChecked) {
      dayNumber = 0.5;
    } else {
      const date1 = new Date(this.workFromHomeRequest.startDate);
      const date2 = new Date(this.workFromHomeRequest.endDate);
      const Difference_In_Time = date2.getTime() - date1.getTime();
      dayNumber = Difference_In_Time / (1000 * 3600 * 24) + 1;
    }
    console.log(dayNumber);
    return dayNumber;
  }
  prepareWorkFromHomeRequest(workFromHomeRequest: WorkFromHomeRequest) {
    if (workFromHomeRequest.workHomeRequestId === 0) {
      workFromHomeRequest.state = 1;
    }
    workFromHomeRequest.motive = '';
    workFromHomeRequest.userFullName = this.resourcesIdentifiers.find(resource =>
      resource.id === workFromHomeRequest.userId).description;
    workFromHomeRequest.dayNumber = this.calculateBetweenDates();
  }
  notifications() {
    if (this.isEdit) {
      const workFromHomeRequestModification = this.checkModification(this.initialWorkFromHomeRequest
        , this.workFromHomeRequest);
      if (workFromHomeRequestModification) {
        this.notificationService.success('This Work From Home Request is modified successfully');
        this.mailService.workFromHomeRequestModified(this.workFromHomeRequest,
          this.initialWorkFromHomeRequest);
      }
    } else {
      this.notificationService.success('This Work From Home Request is added successfully');
      this.mailService.workFromHomeRequestAdded(this.workFromHomeRequest);
    }

  }

  save() {
    if (this.workFromHomeRequestForm.valid) {
      if (this.formControl()) {

        this.prepareWorkFromHomeRequest(this.workFromHomeRequest);
        this.workFromHomeService.IsDateExistOrInProgressWorkHome(this.workFromHomeRequest.workHomeRequestId
          , this.workFromHomeRequest.userId, this.workFromHomeRequest.startDate, this.workFromHomeRequest.endDate).subscribe(
            data => {
              switch (data) {
                case 0: {
                  this.workFromHomeService.insertOrUpdateWorkFromHomeRequest(this.workFromHomeRequest).subscribe(
                    () => {
                      this.notifications();
                      this.close();
                      this.workFromHomeService.refreshWorkFomHomeRequest.next();
                    }
                  );
                  break;
                }
                case 1: {
                  this.close();
                  this.workFromHomeService.refreshWorkFomHomeRequest.next();
                  this.notificationService.danger('This Work From Home Request does not yet exist or not in progress');
                  break;
                }
                case 2: {
                  this.notificationService.danger('This person has a work from home request at this date.');
                  break;
                }
              }
            }
          );

      } else {
        this.notificationService.danger(this.errorMessage);
      }
    } else {
      this.notificationService.danger('Please fill all required fields');
    }
  }

  checkModification(oldWorkFromHomeRequest: WorkFromHomeRequest, newWorkFromHomeRequest: WorkFromHomeRequest): boolean {
    let modification = false;
    if ((oldWorkFromHomeRequest.startDate !== newWorkFromHomeRequest.startDate)
      || (oldWorkFromHomeRequest.endDate !== newWorkFromHomeRequest.endDate)
      || (oldWorkFromHomeRequest.halfDay !== newWorkFromHomeRequest.halfDay)
      || (oldWorkFromHomeRequest.dayNumber !== newWorkFromHomeRequest.dayNumber)) {
      modification = true;
    }
    return modification;
  }

  getWorkFromHomeRequestInProgress() {
    if (this.workFromHomeRequestId) {
      this.workFromHomeService.getWorkHomeRequestInProgress(this.workFromHomeRequestId)
        .subscribe(
          data => {
            if (data.length !== 0) {
              this.workFromHomeRequest = Object.assign(new WorkFromHomeRequest, data[0]);
              this.workFromHomeRequest.startDate = new Date(this.workFromHomeRequest.startDate);
              this.workFromHomeRequest.endDate = new Date(this.workFromHomeRequest.endDate);
              this.initialWorkFromHomeRequest = Object.assign(new WorkFromHomeRequest, data[0]);
              this.initialWorkFromHomeRequest.startDate = new Date(this.initialWorkFromHomeRequest.startDate);
              this.initialWorkFromHomeRequest.endDate = new Date(this.initialWorkFromHomeRequest.endDate);
              if (this.workFromHomeRequest.halfDay !== null) {
                this.isHalfDayChecked = true;
              }
            } else {
              this.close();
              this.workFromHomeService.refreshWorkFomHomeRequest.next();
              this.notificationService.danger('This Work From Home Request does not yet exist or not in progress');
            }
          }
        );
    }

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

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
}
onFileSelected(event) {
  this.selectedFile = event.target.files[0];
}
}
