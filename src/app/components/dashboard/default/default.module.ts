import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToDoListReadDirective, AppToDoListRemoveDirective, DefaultComponent } from './default.component';
import { DefaultRoutingModule } from './default-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ChartModule } from 'angular2-chartjs';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    SharedModule,
    ChartModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [
    DefaultComponent,
    AppToDoListReadDirective,
    AppToDoListRemoveDirective,
  ],
  bootstrap: [DefaultComponent]
})
export class DefaultModule { }
