import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { SeatAllocation } from './seat-allocation.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeatAllocationService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<SeatAllocation[]> = new BehaviorSubject<SeatAllocation[]>([]);
  dialogData!: SeatAllocation;

  get data(): SeatAllocation[] {
    return this.dataChange.value;
  }

  getDialogData(): SeatAllocation {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): SeatAllocation {
    return new SeatAllocation({
      id: item.id,
      student_name: item.studentName || '',
      application_no: item.applicationNo || '',
      course: item.course || '',
      category: item.category || '',
      allotted_seat_type: item.allottedSeatType || '',
      allocation_date: item.allocationDate || '',
      reporting_date: item.reportingDate || '',
      status: item.status || '',
      fees_paid: item.feesPaid || false
    });
  }

  getAllSeatAllocations(): Observable<SeatAllocation[]> {
    const body = {
      query: `
        query GetSeatAllocations {
          seatAllocations {
            id
            studentName
            applicationNo
            course
            category
            allottedSeatType
            allocationDate
            reportingDate
            status
            feesPaid
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch seat allocations');
        }
        const list = res.data.seatAllocations || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addSeatAllocation(seatAllocation: SeatAllocation): Observable<SeatAllocation> {
    const body = {
      query: `
        mutation CreateSeatAllocation($input: CreateSeatAllocationInput!) {
          createSeatAllocation(input: $input) {
            id
            studentName
            applicationNo
            course
            category
            allottedSeatType
            allocationDate
            reportingDate
            status
            feesPaid
          }
        }
      `,
      variables: {
        input: {
          studentName: seatAllocation.student_name,
          applicationNo: seatAllocation.application_no,
          course: seatAllocation.course,
          category: seatAllocation.category,
          allottedSeatType: seatAllocation.allotted_seat_type,
          allocationDate: seatAllocation.allocation_date,
          reportingDate: seatAllocation.reporting_date,
          status: seatAllocation.status,
          feesPaid: !!seatAllocation.fees_paid
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create seat allocation entry');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createSeatAllocation);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateSeatAllocation(seatAllocation: SeatAllocation): Observable<SeatAllocation> {
    const body = {
      query: `
        mutation UpdateSeatAllocation($input: UpdateSeatAllocationInput!) {
          updateSeatAllocation(input: $input) {
            id
            studentName
            applicationNo
            course
            category
            allottedSeatType
            allocationDate
            reportingDate
            status
            feesPaid
          }
        }
      `,
      variables: {
        input: {
          id: String(seatAllocation.id),
          studentName: seatAllocation.student_name,
          applicationNo: seatAllocation.application_no,
          course: seatAllocation.course,
          category: seatAllocation.category,
          allottedSeatType: seatAllocation.allotted_seat_type,
          allocationDate: seatAllocation.allocation_date,
          reportingDate: seatAllocation.reporting_date,
          status: seatAllocation.status,
          feesPaid: !!seatAllocation.fees_paid
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update seat allocation entry');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateSeatAllocation);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteSeatAllocation(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteSeatAllocation($id: String!) {
          deleteSeatAllocation(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete seat allocation entry');
        }
        return res.data.deleteSeatAllocation;
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
