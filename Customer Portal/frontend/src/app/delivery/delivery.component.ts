import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector:'app-delivery',
  standalone:true,
  templateUrl:'./delivery.component.html',
  styleUrls:['./delivery.component.css'],
  imports:[CommonModule,HttpClientModule,FormsModule]
})
export class DeliveryComponent implements OnInit {

  deliveryList:any[]=[];
  filteredDelivery:any[]=[];
  searchText="";

  constructor(private http:HttpClient, private router:Router, private customerService:CustomerService){}

  ngOnInit(){
    const id = this.customerService.getCustomerId();
    if(!id){ alert("Customer not logged in."); return; }

    this.http.get(`http://localhost:3000/api/delivery?customerId=${id}`)
      .subscribe((res:any)=>{
        this.deliveryList = res?.deliveryList || [];
        this.filteredDelivery=[...this.deliveryList];
      });
  }

  applyFilter(){
    const t=this.searchText.toLowerCase();
    this.filteredDelivery = this.deliveryList.filter(d =>
      d.DELIVERY_NO.toLowerCase().includes(t) ||
      d.MAT_CODE.toLowerCase().includes(t) ||
      d.DESCRIPTION.toLowerCase().includes(t) ||
      d.STATUS.toLowerCase().includes(t)
    );
  }

  clearSearch(){ this.searchText=""; this.filteredDelivery=[...this.deliveryList]; }
  goBack(){ this.router.navigate(['/dashboard']); }
  logout(){ this.router.navigate(['/login']); }

  convertUnit(u:string){ return u=="EA"?"Each":u=="KG"?"Kilogram":u; }
  convertStatus(s:string){ return s=="C"?"Completely Processed":s=="A"?"Not Yet Processed":s; }
  formatDate(d:string){ if(!d)return"-"; let [y,m,da]=d.split("-"); return `${da}-${m}-${y}`; }
}
