import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';   // ✅ ADD THIS
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

  // ⬇️ MUST ADD CommonModule HERE
  imports: [
    CommonModule
  ]
})
export class DashboardComponent {

  vendorId = '';
  menuOpen = false;
  showFinance = false;

  constructor(private router: Router, private vendorService: VendorService) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  openFinance() { this.showFinance = true; }

  closeFinance() { this.showFinance = false; }

  goProfile() { this.router.navigate(['/vendor-profile']); }
  logout() {
    this.vendorService.logout();
    this.router.navigate(['/vendor-login']);
  }

  goPO() { this.router.navigate(['/purchase-order']); }
  goGR() { this.router.navigate(['/gr']); }
  goRFQ() { this.router.navigate(['/rfq']); }
  goInvoices() { this.router.navigate(['/invoice']); }
  goPayment() { this.router.navigate(['/payment']); }
  goCD() { this.router.navigate(['/creditdebit']); }
}
