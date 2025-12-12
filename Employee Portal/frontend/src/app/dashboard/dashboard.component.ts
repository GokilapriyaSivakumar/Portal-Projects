import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {

  sidebarOpen = false;
  empId = "";

  constructor(private empService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    const user = this.empService.getEmployee();
    if (!user) { this.router.navigate(['/login']); return; }
    this.empId = user.empId;
  }

  toggleSidebar(){ this.sidebarOpen = !this.sidebarOpen; }

  goToProfile(){ this.router.navigate(['/profile']); }

  logout(){
    this.empService.logout();
    this.router.navigate(['/login']);
  }
}
