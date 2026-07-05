import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Classes } from './classes.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Classes[]> = new BehaviorSubject<Classes[]>([]);
  dialogData!: Classes;

  get data(): Classes[] {
    return this.dataChange.value;
  }

  getDialogData(): Classes {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Classes {
    return new Classes({
      id: item.id,
      className: item.className || '',
      section: item.section || '',
      academicYear: item.academicYear || '',
      teacher: item.teacher || '',
      status: item.status || 'Active',
      studentCount: item.studentCount || '',
      roomNumber: item.roomNumber || '',
    });
  }

  getAllClasses(): Observable<Classes[]> {
    const body = {
      query: `
        query GetAcademicClassesList {
          academicClassesList {
            id
            className
            section
            academicYear
            teacher
            status
            studentCount
            roomNumber
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch academic classes');
        }
        const list = res.data.academicClassesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addClass(classes: Classes): Observable<Classes> {
    const body = {
      query: `
        mutation CreateAcademicClass($input: CreateAcademicClassCustomInput!) {
          createAcademicClass(input: $input) {
            id
            className
            section
            academicYear
            teacher
            status
            studentCount
            roomNumber
          }
        }
      `,
      variables: {
        input: {
          className: classes.className,
          section: classes.section,
          academicYear: classes.academicYear,
          teacher: classes.teacher || '',
          status: classes.status,
          studentCount: classes.studentCount || '',
          roomNumber: classes.roomNumber || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create academic class');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAcademicClass);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateClass(classes: Classes): Observable<Classes> {
    const body = {
      query: `
        mutation UpdateAcademicClass($input: UpdateAcademicClassCustomInput!) {
          updateAcademicClass(input: $input) {
            id
            className
            section
            academicYear
            teacher
            status
            studentCount
            roomNumber
          }
        }
      `,
      variables: {
        input: {
          id: String(classes.id),
          className: classes.className,
          section: classes.section,
          academicYear: classes.academicYear,
          teacher: classes.teacher || '',
          status: classes.status,
          studentCount: classes.studentCount || '',
          roomNumber: classes.roomNumber || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update academic class');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAcademicClass);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteClass(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAcademicClass($id: String!) {
          deleteAcademicClass(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete academic class');
        }
        return res.data.deleteAcademicClass;
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
