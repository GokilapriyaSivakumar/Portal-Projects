import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  clear() {
    throw new Error('Method not implemented.');
  }

  private vendorId: string = '';
  private rawVendorId: string = '';

  constructor() {
    // load from localStorage on service creation
    this.vendorId = localStorage.getItem('vendorId') || '';
    this.rawVendorId = localStorage.getItem('rawVendorId') || '';
  }

  // Store padded vendorId (backend format)
  setVendorId(id: string) {
    this.vendorId = id;
    localStorage.setItem('vendorId', id);   // <-- IMPORTANT
  }

  getVendorId() {
    return this.vendorId || localStorage.getItem('vendorId') || '';
  }

  // Store raw vendorId typed in login box
  setRawVendorId(id: string) {
    this.rawVendorId = id;
    localStorage.setItem('rawVendorId', id);  // <-- IMPORTANT
  }

  getRawVendorId() {
    return this.rawVendorId || localStorage.getItem('rawVendorId') || '';
  }

  logout() {
    this.vendorId = '';
    this.rawVendorId = '';
    localStorage.removeItem('vendorId');
    localStorage.removeItem('rawVendorId');
  }
}
