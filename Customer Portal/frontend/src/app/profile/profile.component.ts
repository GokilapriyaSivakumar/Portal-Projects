import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';   // ⭐ REQUIRED IMPORT

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private router: Router                  // ⭐ FIX — INJECTED HERE
  ) { }

  ngOnInit(): void {
    const customerNumber =
      this.customerService.getCustomerId() || '0000000001';

    this.fetchProfile(customerNumber);
  }

  fetchProfile(customerNumber: string) {
    this.loading = true;
    this.error = '';

    this.http.get<any>(`http://localhost:3000/api/profile?kunnr=${customerNumber}`)
      .subscribe({
        next: (res) => {
          this.profile = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load profile. Please try again.';
          this.loading = false;
        }
      });
  }

  // 🔥 Navigation works now — no more undefined error
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
