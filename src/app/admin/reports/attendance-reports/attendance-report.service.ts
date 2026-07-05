import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AttendanceReport } from './attendance-report.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceReportService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<AttendanceReport[]> = new BehaviorSubject<AttendanceReport[]>([]);
  dialogData!: AttendanceReport;

  get data(): AttendanceReport[] {
    return this.dataChange.value;
  }

  getDialogData(): AttendanceReport {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): AttendanceReport {
    return new AttendanceReport({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      reportType: item.reportType || '',
      className: item.className || '',
      dateFrom: item.dateFrom ? item.dateFrom.split('T')[0] : '',
      dateTo: item.dateTo ? item.dateTo.split('T')[0] : '',
      attendancePercentage: item.attendancePercentage || 0,
      generatedBy: item.generatedBy || '',
      date: item.date ? item.date.split('T')[0] : '',
      status: item.status || '',
    });
  }

  getAllAttendanceReports(): Observable<AttendanceReport[]> {
    const body = {
      query: `
        query GetAttendanceReportsList {
          attendanceReportsList {
            id
            img
            reportType
            className
            dateFrom
            dateTo
            attendancePercentage
            generatedBy
            date
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch attendance reports');
        }
        const list = res.data.attendanceReportsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAttendanceReport(report: AttendanceReport): Observable<AttendanceReport> {
    const body = {
      query: `
        mutation CreateAttendanceReport($input: CreateAttendanceReportCustomInput!) {
          createAttendanceReport(input: $input) {
            id
            img
            reportType
            className
            dateFrom
            dateTo
            attendancePercentage
            generatedBy
            date
            status
          }
        }
      `,
      variables: {
        input: {
          img: report.img || 'assets/images/user/new.jpg',
          reportType: report.reportType,
          className: report.className,
          dateFrom: report.dateFrom || '',
          dateTo: report.dateTo || '',
          attendancePercentage: Number(report.attendancePercentage),
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create attendance report');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAttendanceReport);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAttendanceReport(report: AttendanceReport): Observable<AttendanceReport> {
    const body = {
      query: `
        mutation UpdateAttendanceReport($input: UpdateAttendanceReportCustomInput!) {
          updateAttendanceReport(input: $input) {
            id
            img
            reportType
            className
            dateFrom
            dateTo
            attendancePercentage
            generatedBy
            date
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(report.id),
          img: report.img || 'assets/images/user/new.jpg',
          reportType: report.reportType,
          className: report.className,
          dateFrom: report.dateFrom || '',
          dateTo: report.dateTo || '',
          attendancePercentage: Number(report.attendancePercentage),
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update attendance report');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAttendanceReport);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAttendanceReport(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAttendanceReport($id: String!) {
          deleteAttendanceReport(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete attendance report');
        }
        return res.data.deleteAttendanceReport;
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
