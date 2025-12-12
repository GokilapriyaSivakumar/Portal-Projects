import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-rfq',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RFQComponent {

  vendorId = '';
  rfqData: any[] = [];
  filteredRFQ: any[] = [];
  searchTerm = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();
    this.loadRFQ();
  }

  loadRFQ() {
    this.http
      .get<any>(`http://localhost:4000/api/vendor/rfq?vendorId=${this.vendorId}`)
      .subscribe({
        next: (res) => {
          this.rfqData = res.data || [];
          this.filteredRFQ = [...this.rfqData];
        },
        error: (err) => {
          console.error('RFQ load error:', err);
        }
      });
  }

  applyFilter() {
    const key = this.searchTerm.toLowerCase();
    this.filteredRFQ = this.rfqData.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(key)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredRFQ = [...this.rfqData];
  }

  goBack() {
    this.router.navigate(['/vendor-dashboard']);
  }

  goProfile() {
    this.router.navigate(['/vendor-profile']);
  }

  logout() {
    this.vendorService.logout();
    this.router.navigate(['/vendor-login']);
  }
}
