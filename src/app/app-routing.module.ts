import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { AuthGuard } from 'app/guards';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { DefaultComponent } from './components/dashboard/default/default.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ChangePasswordComponent } from './components/auth/change-password/change-password.component';

import { ListUserComponent } from './components/user/list-user/list-user.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { WorkFromHomeRequestTableComponent } from './components/human-resources/work-from-home/work-from-home-request/work-from-home-request-table/work-from-home-request-table.component';
import { TicketComponent } from './components/ticket/ticket.component';

import { Projet1Component } from './components/test/projet1/projet1.component';
import { EditComponent } from './components/test/edit/edit.component';
import { TicketsComponent } from './components/Alltickets/dialog/tickets/tickets.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AgentComponent } from './components/agent/agent.component';
import { DetailComponent } from './components/agent/detail/detail.component';









const routes: Routes = [
  {path:'',redirectTo:'login', pathMatch:'prefix'},
  {path:'login', component: LoginComponent},
  {path:'reset', component: ResetPasswordComponent},
  {path:'change', component: ChangePasswordComponent},
  {path:'profile', component: ProfileComponent},
  {path:'nav', component: NavbarComponent},
  {path: 'users', component: ListUserComponent,canActivate:[AuthGuard]},
  { canActivate: [AuthGuard],path:'ticket',component:TicketComponent},
  {path: 'user-details/:userId', component: DetailComponent},




  {path:'agent',component:AgentComponent},
  
  //test
  {path:'pro',component:Projet1Component},
  {path:'edit',component:EditComponent},
  {path:'newticket',component:TicketsComponent},
  //end test
  
  {
    //canActivate: [AuthGuard],
    path: 'from-home',
    component: DefaultComponent},

  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'pages',
        loadChildren: () => import('./components/extra-pages/pages.module').then(m => m.PagesModule)
      },
    ]
  },
  {
    path: '',
    component: AdminComponent,
   // canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'project-management',
        loadChildren: () => import('./components/project-management/project-management.module').then(m => m.ProjectManagementModule)
      },
      {
        path: 'human-resources',
        loadChildren: () => import('./components/human-resources/human-resources.module').then(m => m.HumanResourcesModule)
      }
    ]
  },
  {
    path: '**', redirectTo: 'pages/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
