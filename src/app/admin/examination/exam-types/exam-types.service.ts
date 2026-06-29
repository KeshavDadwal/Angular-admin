import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ExamType } from './exam-types.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExamTypesService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<ExamType[]> = new BehaviorSubject<ExamType[]>([]);
  dialogData!: ExamType;

  get data(): ExamType[] {
    return this.dataChange.value;
  }

  getDialogData(): ExamType {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): ExamType {
    return new ExamType({
      id: item.id,
      exam_name: item.examName || '',
      exam_code: item.examCode || '',
      description: item.description || '',
      status: item.status || ''
    });
  }

  getAllExamTypes(): Observable<ExamType[]> {
    const body = {
      query: `
        query GetExamTypes {
          examTypes {
            id
            examName
            examCode
            description
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch exam types');
        }
        const list = res.data.examTypes || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addExamType(examType: ExamType): Observable<ExamType> {
    const body = {
      query: `
        mutation CreateExamType($input: CreateExamTypeInput!) {
          createExamType(input: $input) {
            id
            examName
            examCode
            description
            status
          }
        }
      `,
      variables: {
        input: {
          examName: examType.exam_name,
          examCode: examType.exam_code,
          description: examType.description,
          status: examType.status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create exam type entry');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createExamType);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateExamType(examType: ExamType): Observable<ExamType> {
    const body = {
      query: `
        mutation UpdateExamType($input: UpdateExamTypeInput!) {
          updateExamType(input: $input) {
            id
            examName
            examCode
            description
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(examType.id),
          examName: examType.exam_name,
          examCode: examType.exam_code,
          description: examType.description,
          status: examType.status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update exam type entry');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateExamType);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteExamType(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteExamType($id: String!) {
          deleteExamType(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete exam type entry');
        }
        return res.data.deleteExamType;
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
