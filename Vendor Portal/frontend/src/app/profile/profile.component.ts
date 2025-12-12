import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  vendorId = "";
  profileData: any = null;
  loading = true;
  errorMessage = "";

  constructor(
    private vendorService: VendorService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();

    if (!this.vendorId) {
      this.router.navigate(['/vendor-login']);
      return;
    }

    this.loadProfile();
  }

  /** Fetch Vendor Profile from Backend */
  loadProfile() {
    this.http
      .get<any>(`http://localhost:4000/api/vendor/profile?vendorId=${this.vendorId}`)
      .subscribe({
        next: (res) => {
          this.profileData = res.data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = "Failed to load profile.";
          this.loading = false;
        }
      });
  }

  /** Back Button */
  goBack() {
    this.router.navigate(['/vendor-dashboard']);
  }

  /** Logout */
  logout() {
    this.vendorService.logout();
    this.router.navigate(['/vendor-login']);
  }
}
