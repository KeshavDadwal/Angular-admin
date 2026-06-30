import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HallAllocation } from './hall-allocation.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HallAllocationService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<HallAllocation[]> = new BehaviorSubject<HallAllocation[]>([]);
  dialogData!: HallAllocation;

  get data(): HallAllocation[] {
    return this.dataChange.value;
  }

  getDialogData(): HallAllocation {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): HallAllocation {
    return new HallAllocation({
      id: item.id,
      exam_name: item.examName || '',
      student_name: item.studentName || '',
      roll_no: item.rollNo || '',
      hall_no: item.hallNo || '',
      seat_no: item.seatNo || ''
    });
  }

  getAllHallAllocations(): Observable<HallAllocation[]> {
    const body = {
      query: `
        query GetHallAllocations {
          hallAllocations {
            id
            examName
            studentName
            rollNo
            hallNo
            seatNo
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch hall allocations');
        }
        const list = res.data.hallAllocations || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addHallAllocation(hallAllocation: HallAllocation): Observable<HallAllocation> {
    const body = {
      query: `
        mutation CreateHallAllocation($input: CreateHallAllocationInput!) {
          createHallAllocation(input: $input) {
            id
            examName
            studentName
            rollNo
            hallNo
            seatNo
          }
        }
      `,
      variables: {
        input: {
          examName: hallAllocation.exam_name,
          studentName: hallAllocation.student_name,
          rollNo: hallAllocation.roll_no,
          hallNo: hallAllocation.hall_no,
          seatNo: hallAllocation.seat_no
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create hall allocation entry');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createHallAllocation);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateHallAllocation(hallAllocation: HallAllocation): Observable<HallAllocation> {
    const body = {
      query: `
        mutation UpdateHallAllocation($input: UpdateHallAllocationInput!) {
          updateHallAllocation(input: $input) {
            id
            examName
            studentName
            rollNo
            hallNo
            seatNo
          }
        }
      `,
      variables: {
        input: {
          id: String(hallAllocation.id),
          examName: hallAllocation.exam_name,
          studentName: hallAllocation.student_name,
          rollNo: hallAllocation.roll_no,
          hallNo: hallAllocation.hall_no,
          seatNo: hallAllocation.seat_no
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update hall allocation entry');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateHallAllocation);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteHallAllocation(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteHallAllocation($id: String!) {
          deleteHallAllocation(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete hall allocation entry');
        }
        return res.data.deleteHallAllocation;
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
