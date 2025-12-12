import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {

  inquiries: any[] = [];
  filteredInquiries: any[] = [];

  searchText: string = "";

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const customerId = this.customerService.getCustomerId();

    if (!customerId) {
      this.errorMessage = "Customer ID missing. Please login again.";
      this.loading = false;
      return;
    }

    this.fetchInquiryData(customerId);
  }

  fetchInquiryData(customerId: string) {
    this.http.get(`http://localhost:3000/api/inquiry`, {
      params: { customerId }
    })
    .subscribe({
      next: (res: any) => {
        this.inquiries = Array.isArray(res.inquiries)
          ? res.inquiries
          : [res.inquiries];

        this.filteredInquiries = [...this.inquiries]; // default

        this.loading = false;
      },
      error: (err) => {
        console.error("Inquiry API Error:", err);
        this.errorMessage = "Failed to load inquiry data.";
        this.loading = false;
      }
    });
  }

  // ⭐ Filter function
  applyFilter() {
    const text = this.searchText.toLowerCase();

    this.filteredInquiries = this.inquiries.filter(i =>
      i.INQUIRY_NO.toLowerCase().includes(text) ||
      i.MAT_CODE.toLowerCase().includes(text) ||
      i.DESCRIPTION.toLowerCase().includes(text) ||
      i.ITEM_DATE.toLowerCase().includes(text)
    );
  }

  // ⭐ Clear search
  clearSearch() {
    this.searchText = "";
    this.filteredInquiries = [...this.inquiries];
  }

  // ⭐ Back to dashboard
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout(){
  this.router.navigate(['/login']);
}
}
