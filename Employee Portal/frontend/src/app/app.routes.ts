import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaveComponent } from './leave/leave.component';
import { PaydataComponent } from './paydata/paydata.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
   { path: 'profile', component: ProfileComponent },
   { path: 'leave', component: LeaveComponent },
  // assuming you already have these components/routes:
  // { path: 'leave', component: LeaveComponent }
   { path: 'paydata', component: PaydataComponent },

  { path: '**', redirectTo: 'login' }
];
