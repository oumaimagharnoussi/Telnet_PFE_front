import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { AuthGuard } from 'app/guards';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { DefaultComponent } from './components/dashboard/default/default.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ChangePasswordComponent } from './components/auth/change-password/change-password.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';



const routes: Routes = [
  {path:'',redirectTo:'login', pathMatch:'prefix'},
  {path:'login', component: LoginComponent},
  {path:'reset', component: ResetPasswordComponent},
  {path:'change', component: ChangePasswordComponent},
  {path:'profile', component: ProfileComponent},
  {path: 'users', component: ListUserComponent},
  {path:'add-user', component:AddUserComponent},
  {path:'update-user', component:UpdateUserComponent},
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
    //canActivate: [AuthGuard],
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
