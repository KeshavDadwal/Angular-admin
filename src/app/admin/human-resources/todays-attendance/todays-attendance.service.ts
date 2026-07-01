import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TodaysAttendance } from './todays-attendance..model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodaysAttendanceService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  private dataChange: BehaviorSubject<TodaysAttendance[]> = new BehaviorSubject<TodaysAttendance[]>([]);
  dialogData!: TodaysAttendance;

  get data(): TodaysAttendance[] {
    return this.dataChange.value;
  }

  getDialogData(): TodaysAttendance {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): TodaysAttendance {
    return new TodaysAttendance({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      name: item.name || '',
      first_in: item.firstIn || '',
      break: item.break || '',
      last_out: item.lastOut || '',
      total: item.total || '',
      status: item.status || '',
      shift: item.shift || '',
    });
  }

  getAllTodays(): Observable<TodaysAttendance[]> {
    const body = {
      query: `
        query GetTodaysAttendanceList {
          todaysAttendanceList {
            id
            img
            name
            firstIn
            break
            lastOut
            total
            status
            shift
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch todays attendance');
        }
        const list = res.data.todaysAttendanceList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addToday(todaysAttendance: TodaysAttendance): Observable<TodaysAttendance> {
    const body = {
      query: `
        mutation CreateTodaysAttendance($input: CreateTodaysAttendanceInput!) {
          createTodaysAttendance(input: $input) {
            id
            img
            name
            firstIn
            break
            lastOut
            total
            status
            shift
          }
        }
      `,
      variables: {
        input: {
          img: todaysAttendance.img || 'assets/images/user/new.jpg',
          name: todaysAttendance.name,
          firstIn: todaysAttendance.first_in,
          break: todaysAttendance.break,
          lastOut: todaysAttendance.last_out,
          total: todaysAttendance.total,
          status: todaysAttendance.status,
          shift: todaysAttendance.shift,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create todays attendance');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createTodaysAttendance);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateToday(todaysAttendance: TodaysAttendance): Observable<TodaysAttendance> {
    const body = {
      query: `
        mutation UpdateTodaysAttendance($input: UpdateTodaysAttendanceInput!) {
          updateTodaysAttendance(input: $input) {
            id
            img
            name
            firstIn
            break
            lastOut
            total
            status
            shift
          }
        }
      `,
      variables: {
        input: {
          id: String(todaysAttendance.id),
          img: todaysAttendance.img || 'assets/images/user/new.jpg',
          name: todaysAttendance.name,
          firstIn: todaysAttendance.first_in,
          break: todaysAttendance.break,
          lastOut: todaysAttendance.last_out,
          total: todaysAttendance.total,
          status: todaysAttendance.status,
          shift: todaysAttendance.shift,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update todays attendance');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateTodaysAttendance);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteToday(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteTodaysAttendance($id: String!) {
          deleteTodaysAttendance(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete todays attendance');
        }
        return res.data.deleteTodaysAttendance;
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
