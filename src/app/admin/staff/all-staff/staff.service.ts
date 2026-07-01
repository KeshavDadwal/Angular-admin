import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Staff } from './staff.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<Staff[]> = new BehaviorSubject<Staff[]>([]);

  dialogData!: Staff;

  // Getter for current data
  get data(): Staff[] {
    return this.dataChange.value;
  }

  // Getter for dialog data
  getDialogData(): Staff {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Staff {
    return new Staff({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      name: item.name || '',
      email: item.email || '',
      address: item.address || '',
      mobile: item.mobile || '',
      department: item.department || '',
      status: item.status || 'Active',
      joining_date: item.joiningDate || '',
      salary: item.salary || '0',
      experience: item.experience || '0 years',
      role: item.role || '',
      date_of_birth: item.dateOfBirth || '',
      gender: item.gender || '',
    });
  }

  /** GET: Fetch all staff */
  getAllStaff(): Observable<Staff[]> {
    const body = {
      query: `
        query GetStaffList {
          staffList {
            id
            img
            name
            email
            address
            mobile
            department
            status
            joiningDate
            salary
            experience
            role
            dateOfBirth
            gender
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch staff list');
        }
        const list = res.data.staffList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new staff member */
  addStaff(staff: Staff): Observable<Staff> {
    const body = {
      query: `
        mutation CreateStaff($input: CreateStaffInput!) {
          createStaff(input: $input) {
            id
            img
            name
            email
            address
            mobile
            department
            status
            joiningDate
            salary
            experience
            role
            dateOfBirth
            gender
          }
        }
      `,
      variables: {
        input: {
          img: staff.img || 'assets/images/user/new.jpg',
          name: staff.name,
          email: staff.email,
          address: staff.address,
          mobile: staff.mobile,
          department: staff.department,
          status: staff.status,
          joiningDate: staff.joining_date || '',
          salary: staff.salary,
          experience: staff.experience,
          role: staff.role,
          dateOfBirth: staff.date_of_birth || '',
          gender: staff.gender,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create staff member');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createStaff);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing staff member */
  updateStaff(staff: Staff): Observable<Staff> {
    const body = {
      query: `
        mutation UpdateStaff($input: UpdateStaffInput!) {
          updateStaff(input: $input) {
            id
            img
            name
            email
            address
            mobile
            department
            status
            joiningDate
            salary
            experience
            role
            dateOfBirth
            gender
          }
        }
      `,
      variables: {
        input: {
          id: staff.id,
          img: staff.img || 'assets/images/user/new.jpg',
          name: staff.name,
          email: staff.email,
          address: staff.address,
          mobile: staff.mobile,
          department: staff.department,
          status: staff.status,
          joiningDate: staff.joining_date || '',
          salary: staff.salary,
          experience: staff.experience,
          role: staff.role,
          dateOfBirth: staff.date_of_birth || '',
          gender: staff.gender,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update staff member');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateStaff);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a staff member by ID */
  deleteStaff(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteStaff($id: String!) {
          deleteStaff(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete staff member');
        }
        return res.data.deleteStaff;
      }),
      catchError(this.handleError)
    );
  }

  deleteMultipleStaff(ids: string[]): Observable<string[]> {
    const obsList = ids.map((id) => this.deleteStaff(id));
    return new Observable<string[]>((observer) => {
      let completedCount = 0;
      const results: string[] = [];
      if (ids.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }
      ids.forEach((id) => {
        this.deleteStaff(id).subscribe({
          next: (deletedId) => {
            results.push(deletedId);
            completedCount++;
            if (completedCount === ids.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (err) => {
            observer.error(err);
          }
        });
      });
    });
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse | Error) {
    const msg = error instanceof HttpErrorResponse ? error.message : error.message;
    console.error('An error occurred:', msg);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
