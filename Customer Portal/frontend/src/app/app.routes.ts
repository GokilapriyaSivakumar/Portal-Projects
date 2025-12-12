import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { InquiryComponent } from './inquiry/inquiry.component';
import { SalesComponent } from './sales/sales.component';
import { DeliveryComponent } from './delivery/delivery.component';

import { InvoiceComponent } from './invoice/invoice.component';
import { PaymentComponent } from './payment/payment.component';
import { OverallSalesComponent } from './overall-sales/overall-sales.component';
import { CreditDebitComponent } from './credit-debit/creditdebit.component';

import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'inquiry', component: InquiryComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'delivery', component: DeliveryComponent },

  { path: 'invoice', component: InvoiceComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'overall-sales', component: OverallSalesComponent },
  { path: 'credit-debit', component: CreditDebitComponent },

  { path: 'profile', component: ProfileComponent },

  { path: '**', redirectTo: 'login' }

  
];
