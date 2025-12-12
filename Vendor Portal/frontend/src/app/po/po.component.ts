import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.css']
})
export class POComponent {

  vendorId = '';
  searchTerm = '';
  poList: any[] = [];
  filteredPO: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();

    if (!this.vendorId) {
      console.warn('Vendor ID missing. Redirecting to login...');
      this.router.navigate(['/vendor-login']);
      return;
    }

    this.loadPO();
  }

  /** Fetch PO Data */
  loadPO() {
    this.http
      .get<any>(`http://localhost:4000/api/vendor/po?vendorId=${this.vendorId}`)
      .subscribe({
        next: (res) => {
          this.poList = res.data || [];
          this.filteredPO = [...this.poList];
        },
        error: (err) => {
          console.error('Error fetching PO:', err);
        }
      });
  }

  /** Back Button */
  goBack() {
    this.router.navigate(['/vendor-dashboard']);
  }

  /** Search Filter */
  clearSearch() {
    this.searchTerm = '';
    this.filteredPO = [...this.poList];
  }


  /** Filter Logic */
  applySearch() {
    const key = this.searchTerm.toLowerCase();

    this.filteredPO = this.poList.filter((po) =>
      Object.values(po).some((val) =>
        String(val).toLowerCase().includes(key)
      )
    );
  }

  /** Trigger filter on typing */
  onSearchKeyup() {
    this.applySearch();
  }

   logout() {
    this.vendorService.logout();
    this.router.navigate(['/vendor-login']);
  }

  goProfile() {
    this.router.navigate(['/vendor-profile']);   // avatar click → profile
  }
}
