import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creditdebit',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './creditdebit.component.html',
  styleUrls: ['./creditdebit.component.css']
})
export class CreditDebitComponent implements OnInit {

  memoList:any[]=[];
  filteredList:any[]=[];
  searchText="";
  loading:boolean=false;
  error:string="";

  constructor(private http:HttpClient, private customerService:CustomerService, private router:Router){}

  ngOnInit(): void {
    const customerId=this.customerService.getCustomerId();
    if(!customerId){ this.error="Customer ID missing."; return; }
    this.fetchMemo(customerId);
  }

  fetchMemo(customerId:string){
    this.loading=true;
    this.http.get(`http://localhost:3000/api/creditdebit?customerId=${customerId}`,{responseType:'text'})
    .subscribe({
      next:(xml)=>{
        this.memoList=this.parseXML(xml);
        this.filteredList=[...this.memoList];
        this.loading=false;
      },
      error:()=>{ this.error="Failed to fetch data"; this.loading=false;}
    });
  }

  applyFilter(){
    const txt=this.searchText.toLowerCase();
    this.filteredList=this.memoList.filter(m =>
      m.billNo.toLowerCase().includes(txt) ||
      m.matCode.toLowerCase().includes(txt) ||
      m.description.toLowerCase().includes(txt) ||
      m.currency.toLowerCase().includes(txt)
    );
  }

  clearSearch(){ this.searchText=""; this.filteredList=[...this.memoList]; }
  goBack(){ this.router.navigate(['/dashboard']); }
  logout(){ this.router.navigate(['/login']); }

  convertUnit(u:string){ return u=="EA"?"Each":u=="KG"?"Kilogram":u; }

  convertType(t: string) {
  return t === "G2" ? "Credit Memo" :
         t === "L2" ? "Debit Memo" :
         t === "F2" ? "Invoice" :
         t;
}


  formatDate(d:string){
    if(!d) return "-";
    let [y,m,day]=d.split("-");
    return `${day}-${m}-${y}`;
  }

  parseXML(xmlString:string):any[]{
    const p=new DOMParser().parseFromString(xmlString,"text/xml");
    return Array.from(p.getElementsByTagName("item")).map(x=>({
      billNo:x.getElementsByTagName("BILL_NO")[0]?.textContent ??"",
      billDate:x.getElementsByTagName("BILL_DATE")[0]?.textContent ??"",
      billType:x.getElementsByTagName("BILL_TYPE")[0]?.textContent ??"",
      matCode:x.getElementsByTagName("MAT_CODE")[0]?.textContent ??"",
      description:x.getElementsByTagName("DESCRIPTION")[0]?.textContent ??"",
      quantity:x.getElementsByTagName("QUANTITY")[0]?.textContent ??"",
      unit:x.getElementsByTagName("UNIT")[0]?.textContent ??"",
      amount:x.getElementsByTagName("NET_AMOUNT")[0]?.textContent ??"",
      currency:x.getElementsByTagName("CURRENCY")[0]?.textContent ??""
    }));
  }
}
