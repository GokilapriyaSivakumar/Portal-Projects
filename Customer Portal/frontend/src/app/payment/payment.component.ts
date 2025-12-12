import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentList:any[] = [];
  filteredPayments:any[] = [];
  searchText="";

  constructor(private http:HttpClient, private customerService:CustomerService, private router:Router){}

  ngOnInit(){
    const customerId=this.customerService.getCustomerId();
    if(!customerId){ alert("Login expired"); return; }
    this.loadPayments(customerId);
  }

  loadPayments(id:string){
    this.http.get(`http://localhost:3000/api/payment?customerId=${id}`,{responseType:"text"})
      .subscribe(res=>{
        this.paymentList=this.parseXML(res);
        this.filteredPayments=[...this.paymentList];
      });
  }

  applyFilter(){
    const t=this.searchText.toLowerCase();
    this.filteredPayments=this.paymentList.filter(p =>
      p.billingDocNo.toLowerCase().includes(t) ||
      p.currency.toLowerCase().includes(t) ||
      p.netValue.toLowerCase().includes(t)
    );
  }

  clearSearch(){ this.searchText=""; this.filteredPayments=[...this.paymentList]; }
  goBack(){ this.router.navigate(['/dashboard']); }
  logout(){ this.router.navigate(['/login']); }

  parseXML(data:string){
    let dom=new DOMParser().parseFromString(data,"text/xml");
    return Array.from(dom.getElementsByTagName("item")).map(x=>({
      billingDocNo:x.getElementsByTagName("BILLING_DOC_NO")[0]?.textContent,
      billingDate:x.getElementsByTagName("BILLING_DATE")[0]?.textContent,  // RAW DATE
      dueDate:x.getElementsByTagName("DUE_DATE")[0]?.textContent,          // RAW DATE
      netValue:x.getElementsByTagName("NET_VALUE")[0]?.textContent,
      currency:x.getElementsByTagName("CURRENCY")[0]?.textContent,
      agingDays:x.getElementsByTagName("AGING_DAYS")[0]?.textContent
    }));
  }
}
