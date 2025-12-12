// 🔽 COPY THIS WHOLE FILE INTO inquiry.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerService } from '../services/customer.service';  // adjust path if needed

export interface InquiryItem {
  [key: string]: any;
}

export interface InquiryResponse {
  customerId: string;
  count: number;
  inquiries: InquiryItem[] | InquiryItem;
}

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  private base = 'http://localhost:3000/api/inquiry';

  constructor(
    private http: HttpClient,
    private customerService: CustomerService
  ) {}

  // ✔ Fetch inquiry list using customerId stored in CustomerService
  fetchInquiries(): Observable<InquiryResponse> {

    const customerId = this.customerService.getCustomerId();

    if (!customerId) {
      throw new Error("Customer ID is missing in CustomerService");
    }

    return this.http.get<InquiryResponse>(this.base, {
      params: { customerId }
    });
  }
}
