import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'vendor-login', component: LoginComponent },
  { path: 'vendor-dashboard', component: DashboardComponent },

  { path: 'purchase-order', loadComponent: () => import('./po/po.component').then(m => m.POComponent) },
  { path: 'rfq', loadComponent: () => import('./rfq/rfq.component').then(m => m.RFQComponent) },
  { path: 'payment', loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'creditdebit', loadComponent: () => import('./creditdebit/creditdebit.component').then(m => m.CreditdebitComponent) },
  { path: 'gr', loadComponent: () => import('./gr/gr.component').then(m => m.GrComponent) },
  {
  path: 'vendor-profile',
  loadComponent: () =>
    import('./profile/profile.component').then(m => m.ProfileComponent)
},

{
  path: 'rfq',
  loadComponent: () =>
    import('./rfq/rfq.component').then(m => m.RFQComponent)
},

  { path: 'invoice', loadComponent: () => import('./invoice/invoice.component').then(m => m.InvoiceComponent) },


  { path: '', redirectTo: 'vendor-login', pathMatch: 'full' }
];
