import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class EmployeeService {

  private employee: any = null;

  setEmployee(data: any) {
    this.employee = data;                  // store emp data
    localStorage.setItem("employee", JSON.stringify(data));  // for persistence
  }

  getEmployee() {
    if (!this.employee) {
      const saved = localStorage.getItem("employee");
      this.employee = saved ? JSON.parse(saved) : null;
    }
    return this.employee;
  }

  logout() {
    this.employee = null;
    localStorage.removeItem("employee");
  }
}
