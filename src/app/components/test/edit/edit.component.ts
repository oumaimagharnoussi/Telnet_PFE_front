import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Reference } from 'app/models/project-management/project';
import { Identifier, User } from 'app/models/shared';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  activitiesIdentifiers: Identifier[];
  documentTypesIdentifiers: Identifier[];
  documentStatesIdentifiers: Identifier[];
  documentConfidentialitiesIdentifiers: any[];
  projectsAbrreviation: any[];
  projectAbrreviation: string;
  confidentialityCode: string;
  disableGenerator = true;
  reference = new Reference();
  isSameActivity = true;
  constructor() { }
  public documentTypeFilterCtrl: FormControl = new FormControl();
  
  public abbrivationFilterCtrl: FormControl = new FormControl();
  ngOnInit(): void {
  }
  getLabelSubmit(): string {
    return this.disableGenerator ? 'Save' : 'Generate & Save';
  }
}
