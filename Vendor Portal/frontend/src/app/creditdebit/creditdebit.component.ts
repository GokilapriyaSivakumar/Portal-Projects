import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-creditdebit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './creditdebit.component.html',
  styleUrls: ['./creditdebit.component.css']
})
export class CreditdebitComponent {

  vendorId = '';
  creditDebitData: any[] = [];
  filteredData: any[] = [];
  searchTerm = '';

  constructor(
    private vendorService: VendorService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();
    this.fetchData();
  }

  fetchData() {
    this.http
      .get<any>(`http://localhost:4000/api/vendor/creditdebit?vendorId=${this.vendorId}`)
      .subscribe({
        next: (res) => {
          this.creditDebitData = res.data || [];
          this.filteredData = this.creditDebitData;
        },
        error: (err) => console.error('Credit/Debit fetch failed', err)
      });
  }

  applyFilter() {
    const t = this.searchTerm.toLowerCase();

    this.filteredData = this.creditDebitData.filter(cd =>
      cd.MemoNumber.toLowerCase().includes(t) ||
      cd.Amount.toString().toLowerCase().includes(t) ||
      cd.Currency.toLowerCase().includes(t) ||
      cd.DocType.toLowerCase().includes(t) ||
      cd.MemoType.toLowerCase().includes(t)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredData = this.creditDebitData;
  }

  goBack() { this.router.navigate(['/vendor-dashboard']); }
  goProfile() { this.router.navigate(['/vendor-profile']); }
  logout() { this.router.navigate(['/vendor-login']); }

}
