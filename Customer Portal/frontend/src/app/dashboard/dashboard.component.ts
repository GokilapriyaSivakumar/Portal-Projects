import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  sidebarOpen = false;
  showFinancialSubmenu = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleFinancialMenu() {
    this.showFinancialSubmenu = !this.showFinancialSubmenu;
  }

  closeSidebarOnOutsideClick(event: Event) {
  if (this.sidebarOpen) {
    this.sidebarOpen = false;
  }
}
  goTo(path: string) {
    this.router.navigate([path]);
  }

  closeSidebar() {
  this.sidebarOpen = false;
}

  logout() {
    this.router.navigate(['/login']);
  }
}
