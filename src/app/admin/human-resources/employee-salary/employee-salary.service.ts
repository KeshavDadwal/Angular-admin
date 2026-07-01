import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EmployeeSalary } from './employee-salary.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSalaryService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  private dataChange: BehaviorSubject<EmployeeSalary[]> = new BehaviorSubject<EmployeeSalary[]>([]);
  dialogData!: EmployeeSalary;

  get data(): EmployeeSalary[] {
    return this.dataChange.value;
  }

  getDialogData(): EmployeeSalary {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): EmployeeSalary {
    return new EmployeeSalary({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      name: item.name || '',
      email: item.email || '',
      payslip: item.payslip || '',
      role: item.role || '',
      empID: item.empId || '',
      department: item.department || '',
      salary: item.salary || '',
      bonus: item.bonus || '',
      deductions: item.deductions || '',
      netSalary: item.netSalary || '',
    });
  }

  getAllEmployeeSalaries(): Observable<EmployeeSalary[]> {
    const body = {
      query: `
        query GetEmployeeSalaries {
          employeeSalaryList {
            id
            img
            name
            email
            payslip
            role
            empId
            department
            salary
            bonus
            deductions
            netSalary
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch employee salaries');
        }
        const list = res.data.employeeSalaryList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addEmployeeSalary(employeeSalary: EmployeeSalary): Observable<EmployeeSalary> {
    const body = {
      query: `
        mutation CreateEmployeeSalary($input: CreateEmployeeSalaryInput!) {
          createEmployeeSalary(input: $input) {
            id
            img
            name
            email
            payslip
            role
            empId
            department
            salary
            bonus
            deductions
            netSalary
          }
        }
      `,
      variables: {
        input: {
          img: employeeSalary.img || 'assets/images/user/new.jpg',
          name: employeeSalary.name,
          email: employeeSalary.email,
          payslip: employeeSalary.payslip,
          role: employeeSalary.role,
          empId: employeeSalary.empID,
          department: employeeSalary.department,
          salary: employeeSalary.salary,
          bonus: employeeSalary.bonus,
          deductions: employeeSalary.deductions,
          netSalary: employeeSalary.netSalary,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create employee salary');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createEmployeeSalary);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateEmployeeSalary(employeeSalary: EmployeeSalary): Observable<EmployeeSalary> {
    const body = {
      query: `
        mutation UpdateEmployeeSalary($input: UpdateEmployeeSalaryInput!) {
          updateEmployeeSalary(input: $input) {
            id
            img
            name
            email
            payslip
            role
            empId
            department
            salary
            bonus
            deductions
            netSalary
          }
        }
      `,
      variables: {
        input: {
          id: String(employeeSalary.id),
          img: employeeSalary.img || 'assets/images/user/new.jpg',
          name: employeeSalary.name,
          email: employeeSalary.email,
          payslip: employeeSalary.payslip,
          role: employeeSalary.role,
          empId: employeeSalary.empID,
          department: employeeSalary.department,
          salary: employeeSalary.salary,
          bonus: employeeSalary.bonus,
          deductions: employeeSalary.deductions,
          netSalary: employeeSalary.netSalary,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update employee salary');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateEmployeeSalary);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteEmployeeSalary(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteEmployeeSalary($id: String!) {
          deleteEmployeeSalary(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete employee salary');
        }
        return res.data.deleteEmployeeSalary;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    const errorMsg = error.message || 'Something went wrong; please try again later.';
    console.error('An error occurred:', errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
