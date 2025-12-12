import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../services/vendor.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gr',
  standalone: true,
  templateUrl: './gr.component.html',
  styleUrls: ['./gr.component.css'],

  // ✅ FIX: Add HttpClientModule here
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class GrComponent {

  vendorId = '';
  grData: any[] = [];
  filteredGR: any[] = [];
  searchTerm = '';

  constructor(private vendorService: VendorService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();
    this.fetchGR();
  }

  fetchGR() {
    this.http
      .get<any>(`http://localhost:4000/api/vendor/gr?vendorId=${this.vendorId}`)
      .subscribe({
        next: (res) => {
          this.grData = res.data || [];
          this.filteredGR = this.grData;
        },
        error: (err) => console.error('GR fetch failed', err)
      });
  }

 applyFilter() {
  const term = this.searchTerm.toLowerCase();

  this.filteredGR = this.grData.filter(gr =>
    gr.MaterialDoc.toString().toLowerCase().includes(term) ||
    gr.Material.toString().toLowerCase().includes(term) ||
    gr.PoNumber.toString().toLowerCase().includes(term)
  );
}


  clearSearch() {
    this.searchTerm = '';
    this.filteredGR = this.grData;
  }

  goBack() { this.router.navigate(['/vendor-dashboard']); }
  goProfile() { this.router.navigate(['/vendor-profile']); }
  logout() { this.router.navigate(['/vendor-login']); }
}
