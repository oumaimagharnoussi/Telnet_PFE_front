import { OnInit, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfile, UserIdentifiers } from 'app/models/shared';
import { AuthenticationService, NotificationService } from 'app/services/shared';

@Component({
    selector: 'app-change-password-component',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    hideCurrentPassword = true;
    hideNewPassword = true;
    hideNewPasswordConfirmed = true;
    userIdentifiers: UserIdentifiers;
    password: string;
    newPassword: string;
    newPasswordConfirmed: string;
    barLabel = 'New Password Strength:';
    passwordStrength = false;
    userProfile: UserProfile;

    constructor(private dialogRef: MatDialogRef<ChangePasswordComponent>,
        private authentication: AuthenticationService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.userIdentifiers = new UserIdentifiers();
    }

    changePassword() {
        this.userProfile = this.authentication.getProfile();
        this.userIdentifiers.identifier = this.userProfile.currentUser.userId.toString();
        this.userIdentifiers.password = this.password;
        this.userIdentifiers.newPassword = this.newPassword;
        this.userIdentifiers.newPasswordConfirmed = this.newPasswordConfirmed;
        if (this.validPasswords()) {
            this.authentication.changePassword(this.userIdentifiers).subscribe(
                (data) => {
                    if (data === 'succeeded') {
                        this.notificationService.success('Your password is updated successfully');
                        this.dialogRef.close();
                    } else {
                        this.notificationService.danger('Verify your old password');
                    }
                }
            );
        }
    }

    getPasswordStrength(passwordStrength: boolean) {
        this.passwordStrength = passwordStrength;
    }

    validPasswords(): boolean {
        if (this.userIdentifiers.password === undefined || this.userIdentifiers.newPassword === undefined
            || this.userIdentifiers.newPasswordConfirmed === undefined) {
            this.notificationService.danger('Please fill all required fields');
            return false;
        }
        if (!this.passwordStrength) {
            this.notificationService.danger('Please fill a strength new password');
            return false;
        }
        if (this.userIdentifiers.password === this.userIdentifiers.newPassword) {
            this.notificationService.danger('Current and new passwords must be different');
            return false;
        }
        if (this.userIdentifiers.newPassword !== this.userIdentifiers.newPasswordConfirmed) {
            this.notificationService.danger('Verify your confirm password');
            return false;
        }
        return true;
    }

    cancel() {
        this.dialogRef.close();
    }

}

