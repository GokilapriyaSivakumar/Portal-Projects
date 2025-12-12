import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  empId: string = "";
  password: string = "";
  loading = false;
  errorMsg = "";
  successMsg = "";

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  onLogin() {
    this.loading = true;
    this.errorMsg = "";
    this.successMsg = "";

    this.http.post<any>("http://localhost:4000/api/login", {
      empId: this.empId,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.status === "SUCCESS") {
          this.successMsg = res.message;

          // Save logged in employee details globally
          this.employeeService.setEmployee({
            empId: this.empId
          });

          setTimeout(() => this.router.navigate(['/dashboard']), 800);
        } else {
          this.errorMsg = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMsg = "Login failed. Please try again.";
      }
    });
  }
}
