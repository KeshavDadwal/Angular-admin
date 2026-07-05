import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FeeReport } from './fee-report.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeeReportService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<FeeReport[]> = new BehaviorSubject<FeeReport[]>([]);
  dialogData!: FeeReport;

  get data(): FeeReport[] {
    return this.dataChange.value;
  }

  getDialogData(): FeeReport {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): FeeReport {
    return new FeeReport({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      reportType: item.reportType || '',
      feeCategory: item.feeCategory || '',
      dateFrom: item.dateFrom ? item.dateFrom.split('T')[0] : '',
      dateTo: item.dateTo ? item.dateTo.split('T')[0] : '',
      totalAmount: item.totalAmount || 0,
      generatedBy: item.generatedBy || '',
      date: item.date ? item.date.split('T')[0] : '',
      status: item.status || '',
    });
  }

  getAllFeeReports(): Observable<FeeReport[]> {
    const body = {
      query: `
        query GetFeeReportsList {
          feeReportsList {
            id
            img
            reportType
            feeCategory
            dateFrom
            dateTo
            totalAmount
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
          throw new Error(res.errors[0].message || 'Failed to fetch fee reports');
        }
        const list = res.data.feeReportsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addFeeReport(report: FeeReport): Observable<FeeReport> {
    const body = {
      query: `
        mutation CreateFeeReport($input: CreateFeeReportCustomInput!) {
          createFeeReport(input: $input) {
            id
            img
            reportType
            feeCategory
            dateFrom
            dateTo
            totalAmount
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
          feeCategory: report.feeCategory,
          dateFrom: report.dateFrom || '',
          dateTo: report.dateTo || '',
          totalAmount: Number(report.totalAmount),
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create fee report');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createFeeReport);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateFeeReport(report: FeeReport): Observable<FeeReport> {
    const body = {
      query: `
        mutation UpdateFeeReport($input: UpdateFeeReportCustomInput!) {
          updateFeeReport(input: $input) {
            id
            img
            reportType
            feeCategory
            dateFrom
            dateTo
            totalAmount
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
          feeCategory: report.feeCategory,
          dateFrom: report.dateFrom || '',
          dateTo: report.dateTo || '',
          totalAmount: Number(report.totalAmount),
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update fee report');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateFeeReport);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteFeeReport(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteFeeReport($id: String!) {
          deleteFeeReport(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete fee report');
        }
        return res.data.deleteFeeReport;
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
