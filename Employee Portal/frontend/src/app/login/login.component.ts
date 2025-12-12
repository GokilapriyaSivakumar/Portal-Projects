import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, RouterModule]
})
export class LoginComponent {

  empId = "";
  password = "";

  errorMsg = "";
  successMsg = "";
  loading = false;

  constructor(
    private http: HttpClient,
    private empService: EmployeeService,
    private router: Router
  ) {}
  ngOnInit() {
  document.documentElement.classList.add("noscroll");
  document.body.classList.add("noscroll");
}

ngOnDestroy() {
  document.documentElement.classList.remove("noscroll");
  document.body.classList.remove("noscroll");
}
  onLogin() {
    this.empId = this.empId.padStart(10, '0');
    this.errorMsg = "";
    this.successMsg = "";
    this.loading = true;

    this.http.post<any>("http://localhost:4000/api/login", {
      empId: this.empId,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.status === "SUCCESS") {
          this.successMsg = "Login Successful! Redirecting...";
          this.empService.setEmployee({ empId: this.empId });

          setTimeout(() => this.router.navigate(['/dashboard']), 1200);
        } else {
          this.errorMsg = res.message || "Invalid ID or Password.";
        }
      },
      error: () => {
        this.loading = false;
        this.errorMsg = "Server error. Please try again.";
      }
    });
  }
}
