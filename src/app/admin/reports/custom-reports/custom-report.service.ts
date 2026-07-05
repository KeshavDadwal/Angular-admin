import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { CustomReport } from './custom-report.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomReportService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<CustomReport[]> = new BehaviorSubject<CustomReport[]>([]);
  dialogData!: CustomReport;

  get data(): CustomReport[] {
    return this.dataChange.value;
  }

  getDialogData(): CustomReport {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): CustomReport {
    return new CustomReport({
      id: item.id,
      reportName: item.reportName || '',
      description: item.description || '',
      category: item.category || '',
      createdBy: item.createdBy || '',
      date: item.date ? item.date.split('T')[0] : '',
      status: item.status || '',
    });
  }

  getAllCustomReports(): Observable<CustomReport[]> {
    const body = {
      query: `
        query GetCustomReportsList {
          customReportsList {
            id
            reportName
            description
            category
            createdBy
            date
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch custom reports');
        }
        const list = res.data.customReportsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addCustomReport(report: CustomReport): Observable<CustomReport> {
    const body = {
      query: `
        mutation CreateCustomReport($input: CreateCustomReportCustomInput!) {
          createCustomReport(input: $input) {
            id
            reportName
            description
            category
            createdBy
            date
            status
          }
        }
      `,
      variables: {
        input: {
          reportName: report.reportName,
          description: report.description,
          category: report.category,
          createdBy: report.createdBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create custom report');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createCustomReport);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateCustomReport(report: CustomReport): Observable<CustomReport> {
    const body = {
      query: `
        mutation UpdateCustomReport($input: UpdateCustomReportCustomInput!) {
          updateCustomReport(input: $input) {
            id
            reportName
            description
            category
            createdBy
            date
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(report.id),
          reportName: report.reportName,
          description: report.description,
          category: report.category,
          createdBy: report.createdBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update custom report');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateCustomReport);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteCustomReport(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteCustomReport($id: String!) {
          deleteCustomReport(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete custom report');
        }
        return res.data.deleteCustomReport;
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
