import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild , AfterViewInit, ElementRef, Renderer2, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'app/components/Alltickets/dialog/dialog.component';
import { DetailComponent } from 'app/components/agent/detail/detail.component';
import { Activitie } from 'app/models/Activitie.model';
import { Groupe } from 'app/models/groupe.model';
import { Groups, User } from 'app/models/shared';
import { ActivitieService } from 'app/services/activitie.service';
import { ApiService } from 'app/services/api.service';
import { AuthService } from 'app/services/auth.service';
import { ChangepasswordService } from 'app/services/changepassword.service';
import { GroupService } from 'app/services/group.service';
import { NotificationService } from 'app/services/shared';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  qrCode: string;
  productForm: FormGroup;
  group: Groupe = new Groupe();
  userId:number;
  selectedGroup: Groupe;
  selectedActivitie: Activitie;
  passwordForm: FormGroup;
  errorMessage: string;
User : User;
user: User = new User();
public userName: string;
public lastName: string;
public email: string;
public userNumber:string;
public groupId:number;
public Activitie:string;
public firstName:string;
public picture: string = null;
currentUser: any;

  constructor(@Inject(MAT_DIALOG_DATA) public editData:any,
  private notificationService: NotificationService,
  private fb: FormBuilder,
  private route : ActivatedRoute,
  private auth:ApiService,
  private formBuilder: FormBuilder,
  private router: Router,
  private renderer: Renderer2,
  private authservice:AuthService,private api:GroupService,
  private act:ActivitieService,
  private servicepass:ChangepasswordService
  ) {}

  ngOnInit(): void {
   
    this.productForm = this.formBuilder.group({
      userNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      picture: ['', Validators.required],
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.matchingPasswords('newPassword', 'confirmPassword') });


    const token = this.authservice.getToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    // Récupérer les informations du user depuis le token
    this.userName = decodedToken.name;
    this.lastName = decodedToken.lastname;
    this.email = decodedToken.email;
    this.userNumber = decodedToken.usernumber;
    this.Activitie = decodedToken.activitie;
    this.groupId = decodedToken.Groups;
    this.firstName = decodedToken.firstname;
    this.picture = decodedToken.pictureUrl;
    this.userId = decodedToken.userId;

    // Remplir les champs du formulaire avec les informations du user
    this.productForm.controls['userNumber'].setValue(this.userNumber);
    this.productForm.controls['firstName'].setValue(this.firstName);
    this.productForm.controls['lastName'].setValue(this.lastName);
    this.productForm.controls['userName'].setValue(this.userName);
    this.productForm.controls['email'].setValue(this.email);
    this.productForm.controls['picture'].setValue(this.picture);

    const userGroupId = decodedToken.Groups;
    this.getGroupById(userGroupId);

    const userActivitieId = decodedToken.activitie;
    this.getActivitieById(userActivitieId);

    this.userId = decodedToken.userId;
    
  }
  
    
  
    getGroupById(groupId: number) {
      this.api.getGroupeById(groupId)
        .subscribe(group => this.selectedGroup = group);
    }
    
    getActivitieById(activityId: number) {
      this.act.getActivitieById(activityId)
        .subscribe(activitie => this.selectedActivitie = activitie);
    }



    updateprofil() {
      const newUserData = this.productForm.value; // Get the updated user data from the form
      const userId = this.userId; // Get the user ID of the logged-in user
    
      // Create a new User object with the updated user data
      const user: User = {
        userId: userId,
        userNumber: newUserData.userNumber,
        userName: newUserData.userName,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        email: newUserData.email,
        picture: newUserData.picture,
        activityId: 0,
        qualification: 0,
        groupId: 0,
        rolesId: [],
        functionsId: [],
        hierarchicalHead1: 0,
        hierarchicalHead2: 0,
        hasSubordinates: false,
        userPassword: ''
      };
    
      // Call the updateUser method with the updated user data
      this.auth.updateUser(userId, user).subscribe({
        next: (res) => {
          console.log(res); // Log the response
          this.notificationService.success("User updated successfully");
    
          // Update the user information in the local storage and the component
          if (this.auth.currentUserValue) {
            this.auth.currentUserValue.userName = user.userName;
            this.auth.currentUserValue.firstName = user.firstName;
            this.auth.currentUserValue.lastName = user.lastName;
            this.auth.currentUserValue.picture = user.picture;
            this.auth.currentUserValue.email = user.email;
            this.auth.currentUserValue.userNumber = user.userNumber;
    
            this.user = this.auth.currentUserValue;
          }
    
          // Update the form controls with the new user data
          this.productForm.patchValue({
            userNumber: user.userNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            picture: user.picture
          });
    
          // Fetch the updated user data and update the form controls
          this.auth.getUserById(userId).subscribe({
            next: (userData) => {
              this.productForm.patchValue({
                userNumber: userData.userNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                userName: userData.userName,
                email: userData.email,
                picture: userData.picture
              });
              
              // Display the profile picture
              const profilePicture = document.getElementById("profilePicture") as HTMLImageElement;
if (profilePicture) {
  profilePicture.src = userData.picture;
}

            },
            error: (err) => {
              console.log(err); // Log the error
              this.notificationService.danger("Error while fetching the user data!!");
            }
          });
    
          // Reset the form after successful update
          this.productForm.reset();
        },
        error: (err) => {
          console.log(err); // Log the error
          this.notificationService.danger("Error while updating the record!!");
        }
      });
    }
    
    
    
    
    
    
    onFileSelected(event: Event): void {
      const file = (event.target as HTMLInputElement).files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.productForm.patchValue({
            picture: reader.result
          });
        };
      }
    }
    
    /*onFileSelected(event) {
      const file: File = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.user.picture = reader.result.toString();
          this.productForm.controls['picture'].setValue(this.user.picture);
        };
      }
    }*/
    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
      return (group: FormGroup): {[key: string]: any} => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];
  
        if (password.value !== confirmPassword.value) {
          return {
            mismatchedPasswords: true
          };
        }
      }
    }



    changePassword(): void {
      if (this.passwordForm.invalid) {
        this.errorMessage = "Please fill in all the fields.";
        return;
      }
  
      const currentPassword = this.passwordForm.get('currentPassword').value;
      const newPassword = this.passwordForm.get('newPassword').value;
  
      this.servicepass.changePassword(this.userId, currentPassword, newPassword)
        .subscribe(() => {
          this.errorMessage = '';
          this.passwordForm.reset();
          this.notificationService.success("Password changed successfully!");
        }, error => {
          this.errorMessage = error.message;
        });
    }
    
    
    
    
deleteProfilePicture(): void {
  // Supprimer la photo de profil de l'utilisateur
  this.picture = '';

  // Mettre à jour le formulaire avec la nouvelle valeur de la photo
  this.productForm.controls['picture'].setValue(this.picture);

  // Enregistrer les modifications du formulaire
  // (À remplacer par la logique de sauvegarde appropriée)
  console.log('Profile picture deleted:', this.picture);
}
    
    
}
