import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoiceList:any[]=[];
  filteredInvoices:any[]=[];
  searchText="";
  isLoading=false;
  errorMessage="";
  loadingPdf:{[key:string]:boolean}={};

  baseUrl='http://localhost:3000/api';

  constructor(private http:HttpClient, private cs:CustomerService, private router:Router){}

  ngOnInit(){
    this.fetchInvoices(); // 🔥 Fetch automatically
  }

  goBack(){ this.router.navigate(['/dashboard']); }
  logout(){ this.router.navigate(['/login']); }

  /* FETCH INVOICES */
  fetchInvoices(){
    const id=this.cs.getCustomerId();
    if(!id){ this.errorMessage="Customer ID missing"; return;}
    this.isLoading=true;

    this.http.post<any[]>(`${this.baseUrl}/invoice`,{customerId:id})
    .subscribe({
      next:(res)=>{
        this.invoiceList=this.removeDuplicates(res||[]);
        this.applyFilter();
        this.isLoading=false;
      },
      error:()=>{
        this.errorMessage="Failed to load invoices";
        this.isLoading=false;
      }
    });
  }

  /* REMOVE DUPLICATES */
  removeDuplicates(arr:any[]){
    const set=new Set();
    return arr.filter(x=>!set.has(x.VBELN) && set.add(x.VBELN));
  }

  /* SEARCH */
  applyFilter(){
    const t=this.searchText.toLowerCase();
    this.filteredInvoices=this.invoiceList.filter(x =>
      x.VBELN?.toLowerCase().includes(t) ||
      x.ARKTX?.toLowerCase().includes(t)
    );
  }

  clearSearch(){this.searchText="";this.applyFilter();}

  /* FORMAT DATE */
  formatDate(d:string){
    if(!d) return "-";
    let [y,m,day]=d.split("-");
    return `${day}-${m}-${y}`;
  }

  /* PDF DOWNLOAD */
  downloadPdf(vbeln:string){
    this.loadingPdf[vbeln]=true;
    this.http.post(`${this.baseUrl}/invoice/download`,{vbeln},{responseType:'blob'})
    .subscribe({
      next:(blob)=>{
        this.loadingPdf[vbeln]=false;
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url;a.download=`invoice_${vbeln}.pdf`;a.click();
        URL.revokeObjectURL(url);
      },
      error:()=>{this.loadingPdf[vbeln]=false;alert("Download Failed") }
    });
  }
}
