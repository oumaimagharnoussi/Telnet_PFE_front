import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'app/models/shared';
import { ApiService } from 'app/services/api.service';
import { GroupService } from 'app/services/group.service';
import { NotificationService } from 'app/services/shared';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  users: { userId: number, firstName: string, lastName: string }[] = [];
  filteredUsers: {userId: number, firstName: string, lastName: string}[] = [];
  userSearch = new FormControl('');
  productForm: FormGroup;
  actionBtn = 'Save';
  groupId: number;
  selectAllValue = 'selectAll';
  selectAllChecked = false;
  selectAllLabel = 'Select All';
  originalData: any[];
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: GroupService,
    public dialog: MatDialogRef<DialogComponent>,
    private userService: ApiService
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      libelle: ['', Validators.required],
      selectedUsers: [[]]
    });
    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['libelle'].setValue(this.editData.libelle);
      this.productForm.controls['selectedUsers'].setValue(this.editData.selectedUsers);
    }
    this.userService.getUsers().subscribe(res => {
      this.users = res;
      this.filteredUsers = res;
    });
    this.userSearch.valueChanges.subscribe(searchValue => {
      this.filteredUsers = this.users.filter(user => {
        const fullName = user.firstName + ' ' + user.lastName;
        return fullName.toLowerCase().includes(searchValue.toLowerCase());
      });
    });
  }

  addGroup(): void {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.createGroupe(this.productForm.value)
          .subscribe({
            next: (res) => {
              this.notificationService.success('Group added successfully');
              this.productForm.reset();
              this.dialog.close('save');
            },
            error: () => {
              this.notificationService.danger('Error while adding the group');
            }
          });
      }
    } else {
      this.updategroup();
    }
  }

  updategroup() {
    this.api.updateGroupe(this.editData.groupId, this.productForm.value)
      .subscribe({
        next: (res) => {
          this.notificationService.success('Team updated successfully');
          this.productForm.reset();
          this.dialog.close('update');
        },
        error: () => {
          this.notificationService.danger('Error while updating the record!!');
        }
      });
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
      const allUserIds = this.users.map(user => user.userId);
      this.productForm.patchValue({ selectedUsers: allUserIds });
    }
    this.selectAllChecked = !this.selectAllChecked;
  }



applyFilter(event: KeyboardEvent) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  const regex = new RegExp(`\\b${filterValue}`, 'gi');
  this.data = this.originalData.filter(user => regex.test(user.firstName + ' ' + user.lastName));
}

}


