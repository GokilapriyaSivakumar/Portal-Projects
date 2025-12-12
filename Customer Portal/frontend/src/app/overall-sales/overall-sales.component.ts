import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/customer.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overall-sales',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './overall-sales.component.html',
  styleUrls: ['./overall-sales.component.css']
})
export class OverallSalesComponent implements OnInit {

  salesList:any[]=[];
  filteredSales:any[]=[];
  searchText="";

  constructor(private http:HttpClient, private customerService:CustomerService, private router:Router){}

  ngOnInit(){
    const id=this.customerService.getCustomerId();
    if(!id) return;

    this.http.get<any>(`http://localhost:3000/api/overallsales/customer?customerId=${id}`)
      .subscribe(res=>{
        const items=res?.ET_OVERALL_SALES;
        this.salesList=Array.isArray(items)?items:(items?[items]:[]);
        this.filteredSales=[...this.salesList];
      });
  }

  applyFilter(){
    const txt=this.searchText.toLowerCase();
    this.filteredSales=this.salesList.filter(x =>
      x.BILLING_DOC_NO.toLowerCase().includes(txt) ||
      x.MATERIAL_NO.toLowerCase().includes(txt) ||
      x.MATERIAL_DESC.toLowerCase().includes(txt) ||
      x.CURRENCY.toLowerCase().includes(txt)
    );
  }

  clearSearch(){ this.searchText=""; this.filteredSales=[...this.salesList]; }

  convertUnit(u:string){ return u=="KG"?"Kilogram":u=="EA"?"Each":u; }

  formatDate(date:string){
      if(!date) return "-";
      let [y,m,d]=date.split("-");
      return `${d}-${m}-${y}`;     // dd-MM-yyyy
  }

  goBack(){ this.router.navigate(['/dashboard']); }
  logout(){ this.router.navigate(['/login']); }
}
