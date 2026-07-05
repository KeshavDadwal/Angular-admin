import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Department } from './department.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  dialogData!: Department;

  get data(): Department[] {
    return this.dataChange.value;
  }

  getDialogData(): Department {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Department {
    return new Department({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      department_name: item.department_name || '',
      hod: item.hod || '',
      phone: item.phone || '',
      email: item.email || '',
      student_capacity: item.student_capacity || '',
      establishedYear: item.establishedYear || '',
      totalFaculty: item.totalFaculty || '',
    });
  }

  getAllDepartments(): Observable<Department[]> {
    const body = {
      query: `
        query GetDepartmentsList {
          departmentsList {
            id
            img
            department_name
            hod
            phone
            email
            student_capacity
            establishedYear
            totalFaculty
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch departments');
        }
        const list = res.data.departmentsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addDepartment(department: Department): Observable<Department> {
    const body = {
      query: `
        mutation CreateDepartment($input: CreateDepartmentCustomInput!) {
          createDepartment(input: $input) {
            id
            img
            department_name
            hod
            phone
            email
            student_capacity
            establishedYear
            totalFaculty
          }
        }
      `,
      variables: {
        input: {
          img: department.img || 'assets/images/user/new.jpg',
          department_name: department.department_name,
          hod: department.hod,
          phone: department.phone,
          email: department.email,
          student_capacity: String(department.student_capacity),
          establishedYear: String(department.establishedYear),
          totalFaculty: String(department.totalFaculty),
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create department');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createDepartment);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateDepartment(department: Department): Observable<Department> {
    const body = {
      query: `
        mutation UpdateDepartment($input: UpdateDepartmentCustomInput!) {
          updateDepartment(input: $input) {
            id
            img
            department_name
            hod
            phone
            email
            student_capacity
            establishedYear
            totalFaculty
          }
        }
      `,
      variables: {
        input: {
          id: String(department.id),
          img: department.img || 'assets/images/user/new.jpg',
          department_name: department.department_name,
          hod: department.hod,
          phone: department.phone,
          email: department.email,
          student_capacity: String(department.student_capacity),
          establishedYear: String(department.establishedYear),
          totalFaculty: String(department.totalFaculty),
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update department');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateDepartment);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteDepartment(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteDepartment($id: String!) {
          deleteDepartment(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete department');
        }
        return res.data.deleteDepartment;
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
