import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { SharedModule, MaterialModule } from './shared/shared.module';
import { MenuItems } from './shared/menu-items/menu-items';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { AuthGuard, AuthGuardLogin, AuthGuardReset } from 'app/guards';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CustomValidators } from 'app/shared/custom-validators/custom-validators';
import { ColorPickerModule } from 'ngx-color-picker';
import { CookieService } from 'ngx-cookie-service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { BotDetectCaptchaModule } from 'angular-captcha';
import { LockScreenComponent } from './components/auth/lock-screen/lock-screen.component';
import { ExpirationSessionComponent } from './components/auth/expiration-session/expiration-session.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ErrorInterceptor } from 'app/interceptors/error.interceptor';
//import { HttpClientInterceptor } from 'app/interceptors/httpClient.interceptor';
import { AuthModule } from './components/auth/auth.module';
import { LockScreenModule } from './components/auth/lock-screen/lock-screen.module';
import { DirectivesModule } from './directives/shared/directives.module';
import { ProjectManagementModule } from './components/project-management/project-management.module';
import { HumanResourcesModule } from './components/human-resources/human-resources.module';
import { WorkFromHomeService } from './services/human-resources/work-from-home';
import {
  NotificationService, ShowErrorsService, GenericService, DateTimeService,
  PagerService, EntityParameterService, SearchFilterService, ExcelService,
  FileService, GroupsService, AuthenticationService, CoreDataService, MailService, SortService
} from './services/shared';
import { NumberFormatter } from './helpers';
import { ProfileComponent } from './components/user/profile/profile.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { PopupComponent } from './components/user/popup/popup.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TicketComponent } from './components/ticket/ticket.component';
import { AddTicketComponent } from './components/ticket/add-ticket/add-ticket.component';

import { Projet1Component } from './components/test/projet1/projet1.component';
import { EditComponent } from './components/test/edit/edit.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { TicketsComponent } from './components/Alltickets/dialog/tickets/tickets.component';
import { DialogComponent } from './components/Alltickets/dialog/dialog.component';
import { AgentComponent } from './components/agent/agent.component';
import { DialogagentComponent } from './components/agent/dialogagent/dialogagent.component';
import { DetailComponent } from './components/agent/detail/detail.component';
import {QRCodeModule} from 'angular2-qrcode'
import { AngularEditorModule } from '@kolkov/angular-editor';

export const CUSTOM_DT_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    BreadcrumbsComponent,
    ExpirationSessionComponent,
    ProfileComponent,
    ListUserComponent,
    PopupComponent,
    TicketComponent,
    AddTicketComponent,
    Projet1Component,
    EditComponent,
    TicketsComponent,
    DialogComponent,
    NavbarComponent,
    AgentComponent,
    DialogagentComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    ProjectManagementModule,
    HumanResourcesModule,
    DirectivesModule,
    MaterialModule,
    ColorPickerModule,
    NgIdleKeepaliveModule.forRoot(),
    MatDialogModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    LockScreenModule,
    AuthModule,
    MatButtonModule,
    BotDetectCaptchaModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
   QRCodeModule,
   AngularEditorModule
   
 
  ],
  entryComponents: [
    AdminComponent,
    LockScreenComponent,
    ExpirationSessionComponent
  ],
  providers: [
    CoreDataService,
    WorkFromHomeService,
    MailService,
    NotificationService,
    MenuItems,
    AuthGuard,
    ShowErrorsService,
    EntityParameterService,
    GenericService,
    DateTimeService,
    PagerService,
    AuthenticationService,
    FileService,
    CustomValidators,
    AuthGuardReset,
    CookieService,
    AuthGuardLogin,
    SearchFilterService,
    ExcelService,
    GroupsService,
    SortService,
    NumberFormatter,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DT_FORMATS },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
