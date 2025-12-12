import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';  // <-- Import

@Component({
  selector: 'app-paydata',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './paydata.component.html',
  styleUrls: ['./paydata.component.css']
})
export class PaydataComponent implements OnInit {

  payDataList:any[] = [];
  loading = true;

  empId = "";  // No hardcoding now

  constructor(private http:HttpClient, private router:Router, private empService:EmployeeService) {}

  ngOnInit(): void {
  const user = this.empService.getEmployee();

  if (!user) {
    this.router.navigate(['/login']);
    return;  // <-- Important (prevents missing return warning)
  }

  this.empId = user.empId;
  this.loadPayData();
}

  goBack(){ this.router.navigate(['/dashboard']); }
  goToProfile(){ this.router.navigate(['/profile']); }

  logout(){
    this.empService.logout();
    this.router.navigate(['/login']);
  }

  /* 🔥 FORMAT DOB → dd/mm/yyyy */
  formatDate(dateString:string){
    const [year,month,day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  loadPayData(){
    this.http.get(`http://localhost:4000/api/paydata?empId=${this.empId}`)
      .subscribe({
        next:(res:any)=>{ this.payDataList=res.payData||[]; this.loading=false; },
        error:()=>{ this.loading=false; alert("Error fetching data"); }
      });
  }

  downloading=false;
  downloaded=false;

  downloadPDF(empId:string){
    this.downloading = true;
    this.downloaded = false;

    this.http.get(`http://localhost:4000/api/paydata/pdf?empId=${empId}`,{ responseType:"blob" })
      .subscribe({
        next:(file)=>{
          const link = document.createElement("a");
          link.href = URL.createObjectURL(file);
          link.download = `PayData_${empId}.pdf`;
          link.click();

          this.downloading=false;
          this.downloaded=true;
          setTimeout(()=> this.downloaded=false,2000);
        },
        error:()=>{ this.downloading=false; alert("❌ PDF Download Failed"); }
      });
  }
}
