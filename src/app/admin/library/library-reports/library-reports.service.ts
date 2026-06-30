import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LibraryReport } from './library-reports.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LibraryReportService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<LibraryReport[]> = new BehaviorSubject<LibraryReport[]>([]);
  dialogData!: LibraryReport;

  get data(): LibraryReport[] {
    return this.dataChange.value;
  }

  getDialogData(): LibraryReport {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): LibraryReport {
    return new LibraryReport({
      id: item.id,
      report_name: item.reportName || '',
      generated_date: item.generatedDate || '',
      type: item.type || '',
      status: item.status || '',
    });
  }

  getAllLibraryReports(): Observable<LibraryReport[]> {
    const body = {
      query: `
        query GetLibraryReports {
          libraryReports {
            id
            reportName
            generatedDate
            type
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch library reports');
        }
        const list = res.data.libraryReports || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addLibraryReport(libraryReport: LibraryReport): Observable<LibraryReport> {
    const body = {
      query: `
        mutation CreateLibraryReport($input: CreateLibraryReportInput!) {
          createLibraryReport(input: $input) {
            id
            reportName
            generatedDate
            type
            status
          }
        }
      `,
      variables: {
        input: {
          reportName: libraryReport.report_name,
          generatedDate: libraryReport.generated_date || '',
          type: libraryReport.type,
          status: libraryReport.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create library report');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createLibraryReport);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateLibraryReport(libraryReport: LibraryReport): Observable<LibraryReport> {
    const body = {
      query: `
        mutation UpdateLibraryReport($input: UpdateLibraryReportInput!) {
          updateLibraryReport(input: $input) {
            id
            reportName
            generatedDate
            type
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(libraryReport.id),
          reportName: libraryReport.report_name,
          generatedDate: libraryReport.generated_date || '',
          type: libraryReport.type,
          status: libraryReport.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update library report');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateLibraryReport);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteLibraryReport(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteLibraryReport($id: String!) {
          deleteLibraryReport(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete library report');
        }
        return res.data.deleteLibraryReport;
      }),
      catchError(this.handleError)
    );
  }

  deleteMultipleLibraryReports(ids: (string | number)[]): Observable<string[]> {
    // Return all deleted ids after deleting sequentially
    const obsList = ids.map((id) => this.deleteLibraryReport(id));
    return new Observable<string[]>((observer) => {
      let completedCount = 0;
      const results: string[] = [];
      if (ids.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }
      ids.forEach((id) => {
        this.deleteLibraryReport(id).subscribe({
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

  private handleError(error: HttpErrorResponse | Error) {
    const msg = error instanceof HttpErrorResponse ? error.message : error.message;
    console.error('An error occurred:', msg);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
