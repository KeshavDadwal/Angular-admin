import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Session } from './sessions.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Session[]> = new BehaviorSubject<Session[]>([]);
  dialogData!: Session;

  get data(): Session[] {
    return this.dataChange.value;
  }

  getDialogData(): Session {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Session {
    return new Session({
      id: item.id,
      sessionName: item.sessionName || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      status: item.status || 'Active',
      instructor: item.instructor || '',
      room: item.room || '',
    });
  }

  getAllSessions(): Observable<Session[]> {
    const body = {
      query: `
        query GetSessionsList {
          sessionsList {
            id
            sessionName
            startDate
            endDate
            status
            instructor
            room
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch sessions');
        }
        const list = res.data.sessionsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addSession(session: Session): Observable<Session> {
    const body = {
      query: `
        mutation CreateSession($input: CreateSessionCustomInput!) {
          createSession(input: $input) {
            id
            sessionName
            startDate
            endDate
            status
            instructor
            room
          }
        }
      `,
      variables: {
        input: {
          sessionName: session.sessionName,
          startDate: session.startDate || '',
          endDate: session.endDate || '',
          status: session.status,
          instructor: session.instructor || '',
          room: session.room || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create session');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createSession);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateSession(session: Session): Observable<Session> {
    const body = {
      query: `
        mutation UpdateSession($input: UpdateSessionCustomInput!) {
          updateSession(input: $input) {
            id
            sessionName
            startDate
            endDate
            status
            instructor
            room
          }
        }
      `,
      variables: {
        input: {
          id: String(session.id),
          sessionName: session.sessionName,
          startDate: session.startDate || '',
          endDate: session.endDate || '',
          status: session.status,
          instructor: session.instructor || '',
          room: session.room || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update session');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateSession);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteSession(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteSession($id: String!) {
          deleteSession(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete session');
        }
        return res.data.deleteSession;
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
