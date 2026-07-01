import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AllHoliday } from './all-holidays.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  private dataChange: BehaviorSubject<AllHoliday[]> = new BehaviorSubject<AllHoliday[]>([]);
  dialogData!: AllHoliday;

  get data(): AllHoliday[] {
    return this.dataChange.value;
  }

  getDialogData(): AllHoliday {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): AllHoliday {
    return new AllHoliday({
      id: item.id,
      holidayName: item.holidayName || '',
      date: item.date ? item.date.split('T')[0] : '',
      location: item.location || '',
      shift: item.shift || '',
      details: item.details || '',
      holidayType: item.holidayType || '',
      createdBy: item.createdBy || '',
      creationDate: item.creationDate ? item.creationDate.split('T')[0] : '',
      approvalStatus: item.approvalStatus || '',
    });
  }

  getAllHolidays(): Observable<AllHoliday[]> {
    const body = {
      query: `
        query GetHolidays {
          holidays {
            id
            holidayName
            date
            location
            shift
            details
            holidayType
            createdBy
            creationDate
            approvalStatus
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch holidays');
        }
        const list = res.data.holidays || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addHoliday(holiday: AllHoliday): Observable<AllHoliday> {
    const body = {
      query: `
        mutation CreateHoliday($input: CreateHolidayInput!) {
          createHoliday(input: $input) {
            id
            holidayName
            date
            location
            shift
            details
            holidayType
            createdBy
            creationDate
            approvalStatus
          }
        }
      `,
      variables: {
        input: {
          holidayName: holiday.holidayName,
          date: holiday.date,
          location: holiday.location,
          shift: holiday.shift,
          details: holiday.details,
          holidayType: holiday.holidayType,
          createdBy: holiday.createdBy,
          creationDate: holiday.creationDate,
          approvalStatus: holiday.approvalStatus,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create holiday');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createHoliday);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateHoliday(holiday: AllHoliday): Observable<AllHoliday> {
    const body = {
      query: `
        mutation UpdateHoliday($input: UpdateHolidayInput!) {
          updateHoliday(input: $input) {
            id
            holidayName
            date
            location
            shift
            details
            holidayType
            createdBy
            creationDate
            approvalStatus
          }
        }
      `,
      variables: {
        input: {
          id: String(holiday.id),
          holidayName: holiday.holidayName,
          date: holiday.date,
          location: holiday.location,
          shift: holiday.shift,
          details: holiday.details,
          holidayType: holiday.holidayType,
          createdBy: holiday.createdBy,
          creationDate: holiday.creationDate,
          approvalStatus: holiday.approvalStatus,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update holiday');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateHoliday);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteHoliday(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteHoliday($id: String!) {
          deleteHoliday(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete holiday');
        }
        return res.data.deleteHoliday;
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
