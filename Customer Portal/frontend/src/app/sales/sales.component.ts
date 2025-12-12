import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-sales',
  standalone:true,
  templateUrl:'./sales.component.html',
  styleUrls:['./sales.component.css'],
  imports:[CommonModule,HttpClientModule,FormsModule]
})
export class SalesComponent implements OnInit {

  sales:any[]=[];
  filteredSales:any[]=[];
  searchText="";

  constructor(private http:HttpClient, private router:Router, private customerService:CustomerService){}

  ngOnInit(){

  const customerId = this.customerService.getCustomerId();
  console.log("🔍 CUSTOMER ID LOADED =", customerId);

  if(!customerId){
    alert("Customer ID Missing — Login again.");
    return;
  }

  this.http.get(`http://localhost:3000/api/sales/customer?customerId=${customerId}`).subscribe({
    next:(res:any)=>{
      console.log("📥 SALES RESPONSE =", res);

      /* ⬇️ Extract correct array from SAP response */
      this.sales = res?.ET_SALES_ORDER_LIST?.item || [];

      this.filteredSales = [...this.sales];
    },
    error:(err)=>{
      console.error("❌ SALES API ERROR", err);
      alert("Unable to fetch Sales Data. Check backend.");
    }
  });
}


  filterData(){
  const txt = this.searchText.toLowerCase();

  this.filteredSales = this.sales.filter(x =>
    x.ORDER_NO?.toLowerCase().includes(txt) ||
    x.MAT_CODE?.toLowerCase().includes(txt) ||
    x.DESCRIPTION?.toLowerCase().includes(txt) ||
    x.STATUS?.toLowerCase().includes(txt)
  );
}


  clearSearch(){ this.searchText=""; this.filteredSales=[...this.sales]; }
  goBack(){ this.router.navigate(['/dashboard']); }
  logout(){ this.router.navigate(['/login']); }

  convertUnit(u:string){ return u=="KG"?"Kilogram":u=="EA"?"Each":u; }
  convertStatus(s:string){ return s=="C"?"Completely Processed":s=="A"?"Not Yet Processed":s; }

  formatDate(date:string){
    if(!date) return "-";
    let [y,m,d]=date.split("-");
    return `${d}-${m}-${y}`;
  }
}
