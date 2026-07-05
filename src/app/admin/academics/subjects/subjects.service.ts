import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Subjects } from './subjects.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Subjects[]> = new BehaviorSubject<Subjects[]>([]);
  dialogData!: Subjects;

  get data(): Subjects[] {
    return this.dataChange.value;
  }

  getDialogData(): Subjects {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Subjects {
    return new Subjects({
      id: item.id,
      subjectName: item.subjectName || '',
      subjectCode: item.subjectCode || '',
      subjectType: item.subjectType || 'Core',
      status: item.status || 'Active',
      prerequisites: item.prerequisites || '',
      credits: item.credits || '',
    });
  }

  getAllSubjects(): Observable<Subjects[]> {
    const body = {
      query: `
        query GetAcademicSubjectsList {
          academicSubjectsList {
            id
            subjectName
            subjectCode
            subjectType
            status
            prerequisites
            credits
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch academic subjects');
        }
        const list = res.data.academicSubjectsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addSubject(subjects: Subjects): Observable<Subjects> {
    const body = {
      query: `
        mutation CreateAcademicSubject($input: CreateAcademicSubjectCustomInput!) {
          createAcademicSubject(input: $input) {
            id
            subjectName
            subjectCode
            subjectType
            status
            prerequisites
            credits
          }
        }
      `,
      variables: {
        input: {
          subjectName: subjects.subjectName,
          subjectCode: subjects.subjectCode,
          subjectType: subjects.subjectType,
          status: subjects.status,
          prerequisites: subjects.prerequisites || '',
          credits: subjects.credits || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create academic subject');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAcademicSubject);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateSubject(subjects: Subjects): Observable<Subjects> {
    const body = {
      query: `
        mutation UpdateAcademicSubject($input: UpdateAcademicSubjectCustomInput!) {
          updateAcademicSubject(input: $input) {
            id
            subjectName
            subjectCode
            subjectType
            status
            prerequisites
            credits
          }
        }
      `,
      variables: {
        input: {
          id: String(subjects.id),
          subjectName: subjects.subjectName,
          subjectCode: subjects.subjectCode,
          subjectType: subjects.subjectType,
          status: subjects.status,
          prerequisites: subjects.prerequisites || '',
          credits: subjects.credits || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update academic subject');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAcademicSubject);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteSubject(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAcademicSubject($id: String!) {
          deleteAcademicSubject(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete academic subject');
        }
        return res.data.deleteAcademicSubject;
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
