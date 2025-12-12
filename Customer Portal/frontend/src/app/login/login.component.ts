import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userid: string = "";
  password: string = "";
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private customerService: CustomerService
  ) {}

  onLogin() {
     this.userid = this.userid.padStart(10, '0');
    if (!this.userid || !this.password) {
      alert("Enter User ID and Password");
      return;
    }

    this.loading = true;

    this.http.post("http://localhost:3000/api/login", {
      customerId: this.userid,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (response.flag === "X") {
          // Store logged-in user ID
          this.customerService.setCustomerId(this.userid);

          // Navigate to dashboard
          this.router.navigate(["/dashboard"]);
        } else {
          alert(response.message || "Invalid credentials");
        }
      },
      error: (err) => {
        this.loading = false;
        alert("Server error. Try again.");
        console.error(err);
      }
    });
  }
}
