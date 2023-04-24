import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';

import { Subject, Subscription } from 'rxjs/index';
import { takeUntil } from 'rxjs/operators';
import { Reference, ReferenceSearch } from 'app/models/project-management/project';
import { Identifier } from 'app/models/shared';
import { ReferenceService } from 'app/services/project-management/project';
import { NotificationService, SearchFilterService, DateTimeService, SortService } from 'app/services/shared';
import { PaginatorPipe } from 'app/pipes/shared';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projet1',
  templateUrl: './projet1.component.html',
  styleUrls: ['./projet1.component.scss']
})
export class Projet1Component implements OnInit {
  @Input() references: Reference[];
  displayedColumns = ['referenceCode', 'title', 'edition', 'creationDate',
    'state', 'type', 'buttons'];
  dataSource = new MatTableDataSource();
  listView = false;
  subscription: Subscription;
  lengthReferences: number;
  constructor( private router: Router,
    
    
     private route: ActivatedRoute
    ) { }

    ngOnInit() {
      
    }
  
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  
    onSortData(sort) {
     
    }
    AddReference() {
      
    }
}
