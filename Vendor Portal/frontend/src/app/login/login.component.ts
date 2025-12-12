import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-vendor-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule   // ✅ THIS FIXES THE ERROR
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  vendorId = "";
  password = "";
  showPass = false;
  errorMsg = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private vendorService: VendorService
  ) {}

  submitLogin() {

    this.vendorService.setRawVendorId(this.vendorId);

    const body = {
      vendorId: this.vendorId,
      password: this.password
    };

    this.http.post<any>("http://localhost:4000/api/vendor/login", body)
      .subscribe({
        next: (res) => {
          if (res?.data?.Status === "S") {

            this.vendorService.setVendorId(res.data.VendorId);

            this.router.navigate(['/vendor-dashboard']);
          } else {
            this.errorMsg = res?.data?.Message || "Invalid login";
          }
        },
        error: () => {
          this.errorMsg = "Login failed! Server error.";
        }
      });
  }
}
