import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../services/employee.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  empId: string = "";
  initials: string = "";
  loading = true;
  data:any = {};

  constructor(private empService:EmployeeService,private http:HttpClient,private router:Router){ }

  ngOnInit(): void {
    const user = this.empService.getEmployee();

    if(!user){
      this.router.navigate(['/login']);
      return;
    }

    this.empId = user.empId;
    this.initials = this.empId.slice(-2).toUpperCase();

    // ****** FINAL API CALL WORKING 100% 🟢 ******
    this.http.get(`http://localhost:4000/api/profile?empId=${this.empId}`)
      .subscribe((res:any) => {
        
        console.log("API RAW:",res);
        this.data = res.profile;   //🔥 Direct mapping now correct
        this.loading = false;
      });
  }

  goBack(){
    this.router.navigate(['/dashboard']);
  }

  logout(){
    this.empService.logout();
    this.router.navigate(['/login']);
  }
}
