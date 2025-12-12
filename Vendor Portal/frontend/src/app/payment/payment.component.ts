import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  vendorId = '';
  paymentData: any[] = [];
  filteredPayments: any[] = [];
  searchTerm = '';

  constructor(private vendorService: VendorService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();
    this.fetchPayments();
  }

  fetchPayments() {
    this.http
      .get<any>(`http://localhost:4000/api/vendor/payment?vendorId=${this.vendorId}`)
      .subscribe({
        next: (res) => {
          this.paymentData = res.data || [];
          this.filteredPayments = this.paymentData;
        },
        error: (err) => console.error('Payment fetch failed', err)
      });
  }

  applyFilter() {
    const t = this.searchTerm.toLowerCase();

    this.filteredPayments = this.paymentData.filter(p =>
      p.InvoiceNumber.toLowerCase().includes(t) ||
      p.Amount.toString().toLowerCase().includes(t) ||
      p.Currency.toLowerCase().includes(t)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredPayments = this.paymentData;
  }

  goBack() { this.router.navigate(['/vendor-dashboard']); }
  goProfile() { this.router.navigate(['/vendor-profile']); }
  logout() { this.router.navigate(['/vendor-login']); }
}
