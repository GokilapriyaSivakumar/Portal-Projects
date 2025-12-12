import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InvoiceComponent implements OnInit {

  vendorId: string = '';

  invoiceList: any[] = [];
  filteredInvoices: any[] = [];
  invoiceListFetched = false;

  filters = { invoiceNumber: '' };

  loadingPdf: { [key: string]: boolean } = {};

  baseUrl = 'http://localhost:4000/api/vendor/invoice';

  constructor(
    private http: HttpClient,
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // get vendorId from service
    this.vendorId = this.vendorService.getVendorId();

    // fix SAP padding (10 digits)
    if (this.vendorId && this.vendorId.length < 10) {
      this.vendorId = this.vendorId.padStart(10, '0');
    }

    if (!this.vendorId) {
      alert("Vendor ID missing. Please login again.");
      this.router.navigate(['/vendor-login']);
      return;
    }

    this.fetchInvoices();
  }

  goBack() {
    this.router.navigate(['/vendor-dashboard']);
  }
 goToProfile() { this.router.navigate(['/vendor-profile']); }
  logout() {
    this.vendorService.logout();
    this.router.navigate(['/vendor-login']);
  }

  // -------------------------------------------
  // FETCH INVOICE DATA
  // -------------------------------------------
  fetchInvoices() {
    const url = `${this.baseUrl}?vendorId=${this.vendorId}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.invoiceList = res.data || [];
        this.filteredInvoices = [...this.invoiceList];
        this.invoiceListFetched = true;
      },
      error: () => {
        this.invoiceListFetched = true;
      }
    });
  }

  // FILTER
  applyFilters() {
    const inv = this.filters.invoiceNumber.toLowerCase();

    this.filteredInvoices = this.invoiceList.filter(item =>
      item.InvoiceNo?.toString().toLowerCase().includes(inv) ||
      item.Description?.toLowerCase().includes(inv)
    );
  }

  clearFilters() {
    this.filters.invoiceNumber = '';
    this.filteredInvoices = [...this.invoiceList];
  }

  // -------------------------------------------
  // DOWNLOAD PDF
  // -------------------------------------------
  downloadPdf(invoiceNumber: string) {
    this.loadingPdf[invoiceNumber] = true;

    this.http
      .get(`http://localhost:4000/api/vendor/invoice/pdf/${invoiceNumber}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          this.loadingPdf[invoiceNumber] = false;

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice_${invoiceNumber}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        },
        error: () => {
          this.loadingPdf[invoiceNumber] = false;
          alert("Failed to download invoice PDF");
        },
      });
  }

  // convert unit display
  formatUnit(unit: string): string {
    if (!unit) return "";
    const u = unit.toUpperCase();
    if (u === "KG") return "Kilogram";
    if (u === "EA") return "Each";
    return u;
  }

  printTable() {
  window.print();
}

}
