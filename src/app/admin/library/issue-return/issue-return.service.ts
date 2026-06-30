import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { IssueReturn } from './issue-return.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IssueReturnService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<IssueReturn[]> = new BehaviorSubject<IssueReturn[]>([]);
  dialogData!: IssueReturn;

  get data(): IssueReturn[] {
    return this.dataChange.value;
  }

  getDialogData(): IssueReturn {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): IssueReturn {
    return new IssueReturn({
      id: item.id,
      book_no: item.bookNo || '',
      book_title: item.bookTitle || '',
      student_name: item.studentName || '',
      roll_no: item.rollNo || '',
      issue_date: item.issueDate || '',
      return_date: item.returnDate || '',
      status: item.status || '',
    });
  }

  getAllIssueReturns(): Observable<IssueReturn[]> {
    const body = {
      query: `
        query GetIssueReturns {
          issueReturns {
            id
            bookNo
            bookTitle
            studentName
            rollNo
            issueDate
            returnDate
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch issue returns');
        }
        const list = res.data.issueReturns || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addIssueReturn(issueReturn: IssueReturn): Observable<IssueReturn> {
    const body = {
      query: `
        mutation CreateIssueReturn($input: CreateIssueReturnInput!) {
          createIssueReturn(input: $input) {
            id
            bookNo
            bookTitle
            studentName
            rollNo
            issueDate
            returnDate
            status
          }
        }
      `,
      variables: {
        input: {
          bookNo: issueReturn.book_no,
          bookTitle: issueReturn.book_title,
          studentName: issueReturn.student_name,
          rollNo: issueReturn.roll_no,
          issueDate: issueReturn.issue_date || '',
          returnDate: issueReturn.return_date || '',
          status: issueReturn.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create issue return');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createIssueReturn);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateIssueReturn(issueReturn: IssueReturn): Observable<IssueReturn> {
    const body = {
      query: `
        mutation UpdateIssueReturn($input: UpdateIssueReturnInput!) {
          updateIssueReturn(input: $input) {
            id
            bookNo
            bookTitle
            studentName
            rollNo
            issueDate
            returnDate
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(issueReturn.id),
          bookNo: issueReturn.book_no,
          bookTitle: issueReturn.book_title,
          studentName: issueReturn.student_name,
          rollNo: issueReturn.roll_no,
          issueDate: issueReturn.issue_date || '',
          returnDate: issueReturn.return_date || '',
          status: issueReturn.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update issue return');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateIssueReturn);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteIssueReturn(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteIssueReturn($id: String!) {
          deleteIssueReturn(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete issue return');
        }
        return res.data.deleteIssueReturn;
      }),
      catchError(this.handleError)
    );
  }

  deleteMultipleIssueReturns(ids: (string | number)[]): Observable<string[]> {
    // Return all deleted ids after deleting sequentially
    const obsList = ids.map((id) => this.deleteIssueReturn(id));
    return new Observable<string[]>((observer) => {
      let completedCount = 0;
      const results: string[] = [];
      if (ids.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }
      ids.forEach((id) => {
        this.deleteIssueReturn(id).subscribe({
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
