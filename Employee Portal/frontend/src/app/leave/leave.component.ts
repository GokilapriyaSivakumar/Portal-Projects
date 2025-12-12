import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave',
  standalone:true,
  templateUrl:'./leave.component.html',
  styleUrls:['./leave.component.css'],
  imports: [CommonModule]
})
export class LeaveComponent implements OnInit {

  @ViewChild('typeCanvas') typeCanvas!:ElementRef<HTMLCanvasElement>;
  @ViewChild('monthCanvas') monthCanvas!:ElementRef<HTMLCanvasElement>;
  @ViewChild('quotaCanvas') quotaCanvas!:ElementRef<HTMLCanvasElement>;

  leaves:any[]=[];
  empId="";

  totalApproved=0;
  availableLeaves=0;

  approvedPercent="0%";
  pendingPercent="0%";
  rejectedPercent="0%";

  constructor(private http:HttpClient, private empService:EmployeeService, private router:Router){}

  ngOnInit():void{
    const user=this.empService.getEmployee();
    if(!user){this.router.navigate(['/login']);return;}
    this.empId=user.empId;

    this.http.get(`http://localhost:4000/api/leave?empId=${this.empId}`).subscribe((res:any)=>{

      this.leaves = res.leaves || [];

      // 🔥 MAP LEAVE CODES
      this.leaves.forEach(l=>{
        if(l.ABSENCE_TYPE=="0300") l.TYPE_NAME="Sick Leave";
        else if(l.ABSENCE_TYPE=="0720") l.TYPE_NAME="Annual Leave";
        else l.TYPE_NAME = l.ABSENCE_QUOTA_TYPE || "Educational Leave";
      });

      this.totalApproved=this.leaves.filter(x=>x.FULLDAY=="X").length;
      this.availableLeaves=5-this.totalApproved;

      this.calcStatusPercent();
      setTimeout(()=>{ this.drawCharts(); },250);
    });
  }

  calcStatusPercent(){
    const a=this.leaves.filter(x=>x.FULLDAY=="X").length;
    const p=this.leaves.filter(x=>x.FULLDAY!="X").length;
    const total=a+p;

    this.approvedPercent = total? (a/total*100).toFixed(0)+"%" : "0%";
    this.pendingPercent  = total? (p/total*100).toFixed(0)+"%" : "0%";
    this.rejectedPercent="0%";
  }

  drawCharts(){

    // ★ PIE CHART USING MAPPED NAMES ★
    const typeCount:any={};
    this.leaves.forEach(l=> typeCount[l.TYPE_NAME]=(typeCount[l.TYPE_NAME]||0)+1);

    new Chart(this.typeCanvas.nativeElement,{
      type:'pie',
      data:{
        labels:Object.keys(typeCount),
        datasets:[{data:Object.values(typeCount), backgroundColor:['#74b77a','#006b3b','#97d8a3']}]
      }
    });

    // BAR CHART
    const monthly=new Array(12).fill(0);
    this.leaves.forEach(l=>{
      if(l.START_DATE && l.START_DATE!=='0000-00-00'){
        const m=Number(l.START_DATE.split("-")[1])-1;
        monthly[m] +=1;
      }
    });

    new Chart(this.monthCanvas.nativeElement,{
      type:'bar',
      data:{
        labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets:[{label:"Leaves",data:monthly, backgroundColor:'#006b3b'}]
      }
    });

    // DOUGHNUT
    new Chart(this.quotaCanvas.nativeElement,{
      type:'doughnut',
      data:{
        labels:["Used","Available"],
        datasets:[{data:[this.totalApproved,this.availableLeaves], backgroundColor:['#18a84a','#a5e6c1']}]
      }
    });
  }

  format(date:string){
    if(!date||date=="0000-00-00") return "-";
    const [y,m,d]=date.split("-"); return `${d}/${m}/${y}`;
  }

  quotaCalc(row:any){return row.FULLDAY=="X"?0:5;}

  goBack(){ this.router.navigate(['/dashboard']); }
  logout(){ localStorage.clear(); this.router.navigate(['/login']); }
}
