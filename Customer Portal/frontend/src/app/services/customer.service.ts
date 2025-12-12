import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customerId: string | null = null;

  setCustomerId(id: string) {
    this.customerId = id;
  }

  getCustomerId(): string | null {
    return this.customerId;
  }
}
