import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AllAssets } from './all-assets.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllAssetsService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<AllAssets[]> = new BehaviorSubject<AllAssets[]>([]);
  dialogData!: AllAssets;

  get data(): AllAssets[] {
    return this.dataChange.value;
  }

  getDialogData(): AllAssets {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): AllAssets {
    return new AllAssets({
      id: item.id,
      no: item.no || '',
      title: item.title || '',
      subject: item.subject || '',
      purchase_date: item.purchaseDate || '',
      department: item.department || '',
      type: item.type || '',
      status: item.status || '',
      last_borrowed: item.lastBorrowed || '',
      borrower_name: item.borrowerName || '',
      due_date: item.dueDate || '',
      shelf_location: item.shelfLocation || '',
    });
  }

  /** GET: Fetch all assets from GraphQL backend */
  getAllAssets(): Observable<AllAssets[]> {
    const body = {
      query: `
        query GetAllAssets {
          allAssets {
            id
            no
            title
            subject
            purchaseDate
            department
            type
            status
            lastBorrowed
            borrowerName
            dueDate
            shelfLocation
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch assets');
        }
        const list = res.data.allAssets || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new asset */
  addAsset(allAssets: AllAssets): Observable<AllAssets> {
    const body = {
      query: `
        mutation CreateLibraryAsset($input: CreateLibraryAssetInput!) {
          createLibraryAsset(input: $input) {
            id
            no
            title
            subject
            purchaseDate
            department
            type
            status
            lastBorrowed
            borrowerName
            dueDate
            shelfLocation
          }
        }
      `,
      variables: {
        input: {
          no: allAssets.no,
          title: allAssets.title,
          subject: allAssets.subject,
          purchaseDate: allAssets.purchase_date || '',
          department: allAssets.department,
          type: allAssets.type,
          status: allAssets.status,
          lastBorrowed: allAssets.last_borrowed || '',
          borrowerName: allAssets.borrower_name || '',
          dueDate: allAssets.due_date || '',
          shelfLocation: allAssets.shelf_location,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create asset');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createLibraryAsset);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing asset */
  updateAsset(allAssets: AllAssets): Observable<AllAssets> {
    const body = {
      query: `
        mutation UpdateLibraryAsset($input: UpdateLibraryAssetInput!) {
          updateLibraryAsset(input: $input) {
            id
            no
            title
            subject
            purchaseDate
            department
            type
            status
            lastBorrowed
            borrowerName
            dueDate
            shelfLocation
          }
        }
      `,
      variables: {
        input: {
          id: String(allAssets.id),
          no: allAssets.no,
          title: allAssets.title,
          subject: allAssets.subject,
          purchaseDate: allAssets.purchase_date || '',
          department: allAssets.department,
          type: allAssets.type,
          status: allAssets.status,
          lastBorrowed: allAssets.last_borrowed || '',
          borrowerName: allAssets.borrower_name || '',
          dueDate: allAssets.due_date || '',
          shelfLocation: allAssets.shelf_location,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update asset');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateLibraryAsset);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove an asset by ID */
  deleteAsset(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteLibraryAsset($id: String!) {
          deleteLibraryAsset(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete asset');
        }
        return res.data.deleteLibraryAsset;
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse | Error) {
    const msg = error instanceof HttpErrorResponse ? error.message : error.message;
    console.error('An error occurred:', msg);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
