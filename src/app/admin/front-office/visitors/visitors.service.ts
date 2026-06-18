import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Visitors } from './visitors.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VisitorsService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Visitors[]> = new BehaviorSubject<Visitors[]>([]);
  dialogData!: Visitors;

  get data(): Visitors[] {
    return this.dataChange.value;
  }

  getDialogData(): Visitors {
    return this.dialogData;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return String(date);
  }

  /** CRUD METHODS */

  /** GET: Fetch visitors */
  getVisitors(): Observable<Visitors[]> {
    const body = {
      query: `
        query GetVisitors {
          visitors {
            visitorId
            visitorName
            visitDate
            visitTime
            purposeOfVisit
            contactNumber
            visitorType
            studentName
            departmentPersonVisited
            checkOutTime
            idProofType
            idProofNumber
            notes
            createdAt
            updatedAt
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch visitors');
        }
        const data = res.data.visitors || [];
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new visitor */
  addVisitor(visitor: Visitors): Observable<Visitors> {
    const body = {
      query: `
        mutation CreateVisitor($input: CreateVisitorInput!) {
          createVisitor(input: $input) {
            visitorId
            visitorName
            visitDate
            visitTime
            purposeOfVisit
            contactNumber
            visitorType
            studentName
            departmentPersonVisited
            checkOutTime
            idProofType
            idProofNumber
            notes
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        input: {
          visitorName: visitor.visitorName,
          visitDate: this.formatDate(visitor.visitDate),
          visitTime: visitor.visitTime,
          purposeOfVisit: visitor.purposeOfVisit,
          contactNumber: visitor.contactNumber,
          visitorType: visitor.visitorType,
          studentName: visitor.studentName || null,
          departmentPersonVisited: visitor.departmentPersonVisited,
          checkOutTime: visitor.checkOutTime || null,
          idProofType: visitor.idProofType || null,
          idProofNumber: visitor.idProofNumber || null,
          notes: visitor.notes || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create visitor');
        }
        const newVisitor = res.data.createVisitor;
        this.dialogData = newVisitor;
        return newVisitor;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing visitor */
  updateVisitor(visitor: Visitors): Observable<Visitors> {
    const body = {
      query: `
        mutation UpdateVisitor($input: UpdateVisitorInput!) {
          updateVisitor(input: $input) {
            visitorId
            visitorName
            visitDate
            visitTime
            purposeOfVisit
            contactNumber
            visitorType
            studentName
            departmentPersonVisited
            checkOutTime
            idProofType
            idProofNumber
            notes
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        input: {
          visitorId: visitor.visitorId,
          visitorName: visitor.visitorName,
          visitDate: this.formatDate(visitor.visitDate),
          visitTime: visitor.visitTime,
          purposeOfVisit: visitor.purposeOfVisit,
          contactNumber: visitor.contactNumber,
          visitorType: visitor.visitorType,
          studentName: visitor.studentName || null,
          departmentPersonVisited: visitor.departmentPersonVisited,
          checkOutTime: visitor.checkOutTime || null,
          idProofType: visitor.idProofType || null,
          idProofNumber: visitor.idProofNumber || null,
          notes: visitor.notes || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update visitor');
        }
        const updatedVisitor = res.data.updateVisitor;
        this.dialogData = updatedVisitor;
        return updatedVisitor;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a visitor by ID */
  deleteVisitor(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteVisitor($visitorId: String!) {
          deleteVisitor(visitorId: $visitorId)
        }
      `,
      variables: {
        visitorId: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete visitor');
        }
        return res.data.deleteVisitor;
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Search visitors by name */
  searchByName(name: string): Observable<Visitors[]> {
    return of(this.data.filter(v => v.visitorName.toLowerCase().includes(name.toLowerCase())));
  }

  /** GET: Filter visitors by date range */
  filterByDateRange(startDate: Date, endDate: Date): Observable<Visitors[]> {
    return of(this.data.filter(v => {
      const d = new Date(v.visitDate);
      return d >= startDate && d <= endDate;
    }));
  }

  /** GET: Filter visitors by purpose */
  filterByPurpose(purpose: string): Observable<Visitors[]> {
    return of(this.data.filter(v => v.purposeOfVisit.toLowerCase().includes(purpose.toLowerCase())));
  }

  /** GET: Get today's visitors */
  getTodayVisitors(): Observable<Visitors[]> {
    const today = this.formatDate(new Date());
    return of(this.data.filter(v => this.formatDate(v.visitDate) === today));
  }

  /** POST: Check out visitor */
  checkOutVisitor(visitorId: string, checkOutTime: Date): Observable<Visitors> {
    const timeStr = checkOutTime.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    const visitor = this.data.find(v => v.visitorId === visitorId);
    if (visitor) {
      visitor.checkOutTime = timeStr;
    }
    return of(visitor || new Visitors());
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
