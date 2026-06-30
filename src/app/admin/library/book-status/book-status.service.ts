import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BookStatus } from './book-status.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookStatusService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<BookStatus[]> = new BehaviorSubject<BookStatus[]>([]);
  dialogData!: BookStatus;

  get data(): BookStatus[] {
    return this.dataChange.value;
  }

  getDialogData(): BookStatus {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): BookStatus {
    return new BookStatus({
      bookStatusID: item.bookStatusID,
      bookID: item.bookID || '',
      bookName: item.bookName || '',
      status: item.status || 'Available',
      dateUpdated: item.dateUpdated || '',
      lastCheckedOutDate: item.lastCheckedOutDate || '',
      dueDate: item.dueDate || '',
      checkedOutBy: item.checkedOutBy || '',
      reservedBy: item.reservedBy || '',
      condition: item.condition || 'Good',
      returnDate: item.returnDate || '',
      notes: item.notes || '',
    });
  }

  /** GET: Fetch all book statuses */
  getBookStatuses(): Observable<BookStatus[]> {
    const body = {
      query: `
        query GetBookStatuses {
          bookStatuses {
            bookStatusID
            bookID
            bookName
            status
            dateUpdated
            lastCheckedOutDate
            dueDate
            checkedOutBy
            reservedBy
            condition
            returnDate
            notes
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch book statuses');
        }
        const list = res.data.bookStatuses || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new book status */
  addBookStatus(bookStatus: BookStatus): Observable<BookStatus> {
    const body = {
      query: `
        mutation CreateBookStatus($input: CreateBookStatusInput!) {
          createBookStatus(input: $input) {
            bookStatusID
            bookID
            bookName
            status
            dateUpdated
            lastCheckedOutDate
            dueDate
            checkedOutBy
            reservedBy
            condition
            returnDate
            notes
          }
        }
      `,
      variables: {
        input: {
          bookID: String(bookStatus.bookID || ''),
          bookName: bookStatus.bookName,
          status: bookStatus.status,
          dateUpdated: bookStatus.dateUpdated || '',
          lastCheckedOutDate: bookStatus.lastCheckedOutDate || '',
          dueDate: bookStatus.dueDate || '',
          checkedOutBy: bookStatus.checkedOutBy || '',
          reservedBy: bookStatus.reservedBy || '',
          condition: bookStatus.condition,
          returnDate: bookStatus.returnDate || '',
          notes: bookStatus.notes || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create book status');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createBookStatus);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing book status */
  updateBookStatus(bookStatus: BookStatus): Observable<BookStatus> {
    const body = {
      query: `
        mutation UpdateBookStatus($input: UpdateBookStatusInput!) {
          updateBookStatus(input: $input) {
            bookStatusID
            bookID
            bookName
            status
            dateUpdated
            lastCheckedOutDate
            dueDate
            checkedOutBy
            reservedBy
            condition
            returnDate
            notes
          }
        }
      `,
      variables: {
        input: {
          bookStatusID: String(bookStatus.bookStatusID),
          bookID: String(bookStatus.bookID || ''),
          bookName: bookStatus.bookName,
          status: bookStatus.status,
          dateUpdated: bookStatus.dateUpdated || '',
          lastCheckedOutDate: bookStatus.lastCheckedOutDate || '',
          dueDate: bookStatus.dueDate || '',
          checkedOutBy: bookStatus.checkedOutBy || '',
          reservedBy: bookStatus.reservedBy || '',
          condition: bookStatus.condition,
          returnDate: bookStatus.returnDate || '',
          notes: bookStatus.notes || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update book status');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateBookStatus);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a book status by ID */
  deleteBookStatus(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteBookStatus($id: String!) {
          deleteBookStatus(id: $id)
        }
      `,
      variables: { id: String(id) }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete book status');
        }
        return res.data.deleteBookStatus;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse | Error) {
    const msg = error instanceof HttpErrorResponse ? error.message : error.message;
    console.error('An error occurred:', msg);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
