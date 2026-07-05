import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Allocation } from './allocations.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllocationService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Allocation[]> = new BehaviorSubject<Allocation[]>([]);
  dialogData!: Allocation;

  get data(): Allocation[] {
    return this.dataChange.value;
  }

  getDialogData(): Allocation {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Allocation {
    return new Allocation({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      student_name: item.student_name || '',
      roll_no: item.roll_no || '',
      hostel_name: item.hostel_name || '',
      room_no: item.room_no || '',
      room_type: item.room_type || '',
      allocation_date: item.allocation_date ? item.allocation_date.split('T')[0] : '',
      status: item.status || 'Active',
    });
  }

  getAllAllocations(): Observable<Allocation[]> {
    const body = {
      query: `
        query GetHostelAllocationsList {
          hostelAllocationsList {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            room_type
            allocation_date
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch hostel allocations');
        }
        const list = res.data.hostelAllocationsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAllocation(allocation: Allocation): Observable<Allocation> {
    const body = {
      query: `
        mutation CreateHostelAllocation($input: CreateHostelAllocationCustomInput!) {
          createHostelAllocation(input: $input) {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            room_type
            allocation_date
            status
          }
        }
      `,
      variables: {
        input: {
          img: allocation.img || 'assets/images/user/new.jpg',
          student_name: allocation.student_name,
          roll_no: allocation.roll_no,
          hostel_name: allocation.hostel_name,
          room_no: allocation.room_no,
          room_type: allocation.room_type,
          allocation_date: allocation.allocation_date || '',
          status: allocation.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create hostel allocation');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createHostelAllocation);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAllocation(allocation: Allocation): Observable<Allocation> {
    const body = {
      query: `
        mutation UpdateHostelAllocation($input: UpdateHostelAllocationCustomInput!) {
          updateHostelAllocation(input: $input) {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            room_type
            allocation_date
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(allocation.id),
          img: allocation.img || 'assets/images/user/new.jpg',
          student_name: allocation.student_name,
          roll_no: allocation.roll_no,
          hostel_name: allocation.hostel_name,
          room_no: allocation.room_no,
          room_type: allocation.room_type,
          allocation_date: allocation.allocation_date || '',
          status: allocation.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update hostel allocation');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateHostelAllocation);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAllocation(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteHostelAllocation($id: String!) {
          deleteHostelAllocation(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete hostel allocation');
        }
        return res.data.deleteHostelAllocation;
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
