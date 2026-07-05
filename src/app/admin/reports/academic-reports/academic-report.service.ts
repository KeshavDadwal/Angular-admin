import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AcademicReport } from './academic-report.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AcademicReportService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<AcademicReport[]> = new BehaviorSubject<AcademicReport[]>([]);
  dialogData!: AcademicReport;

  get data(): AcademicReport[] {
    return this.dataChange.value;
  }

  getDialogData(): AcademicReport {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): AcademicReport {
    return new AcademicReport({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      reportType: item.reportType || '',
      className: item.className || '',
      subject: item.subject || '',
      academicYear: item.academicYear || '',
      term: item.term || '',
      generatedBy: item.generatedBy || '',
      date: item.date ? item.date.split('T')[0] : '',
      status: item.status || '',
    });
  }

  getAllAcademicReports(): Observable<AcademicReport[]> {
    const body = {
      query: `
        query GetAcademicReportsList {
          academicReportsList {
            id
            img
            reportType
            className
            subject
            academicYear
            term
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
          throw new Error(res.errors[0].message || 'Failed to fetch academic reports');
        }
        const list = res.data.academicReportsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAcademicReport(report: AcademicReport): Observable<AcademicReport> {
    const body = {
      query: `
        mutation CreateAcademicReport($input: CreateAcademicReportCustomInput!) {
          createAcademicReport(input: $input) {
            id
            img
            reportType
            className
            subject
            academicYear
            term
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
          subject: report.subject,
          academicYear: report.academicYear,
          term: report.term,
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create academic report');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAcademicReport);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAcademicReport(report: AcademicReport): Observable<AcademicReport> {
    const body = {
      query: `
        mutation UpdateAcademicReport($input: UpdateAcademicReportCustomInput!) {
          updateAcademicReport(input: $input) {
            id
            img
            reportType
            className
            subject
            academicYear
            term
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
          subject: report.subject,
          academicYear: report.academicYear,
          term: report.term,
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update academic report');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAcademicReport);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAcademicReport(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAcademicReport($id: String!) {
          deleteAcademicReport(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete academic report');
        }
        return res.data.deleteAcademicReport;
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
