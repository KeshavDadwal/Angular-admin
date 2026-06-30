import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ResultGeneration } from './result-generation.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResultGenerationService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<ResultGeneration[]> = new BehaviorSubject<ResultGeneration[]>([]);
  dialogData!: ResultGeneration;

  get data(): ResultGeneration[] {
    return this.dataChange.value;
  }

  getDialogData(): ResultGeneration {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): ResultGeneration {
    return new ResultGeneration({
      id: item.id,
      exam_name: item.examName || '',
      course: item.course || '',
      semester: item.semester || '',
      result_date: item.resultDate || '',
      status: item.status || '',
    });
  }

  getAllResultGenerations(): Observable<ResultGeneration[]> {
    const body = {
      query: `
        query GetResultGenerations {
          resultGenerations {
            id
            examName
            course
            semester
            resultDate
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch result generations');
        }
        const list = res.data.resultGenerations || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addResultGeneration(resultGeneration: ResultGeneration): Observable<ResultGeneration> {
    const body = {
      query: `
        mutation CreateResultGeneration($input: CreateResultGenerationInput!) {
          createResultGeneration(input: $input) {
            id
            examName
            course
            semester
            resultDate
            status
          }
        }
      `,
      variables: {
        input: {
          examName: resultGeneration.exam_name,
          course: resultGeneration.course,
          semester: resultGeneration.semester,
          resultDate: resultGeneration.result_date,
          status: resultGeneration.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create result generation');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createResultGeneration);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateResultGeneration(resultGeneration: ResultGeneration): Observable<ResultGeneration> {
    const body = {
      query: `
        mutation UpdateResultGeneration($input: UpdateResultGenerationInput!) {
          updateResultGeneration(input: $input) {
            id
            examName
            course
            semester
            resultDate
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(resultGeneration.id),
          examName: resultGeneration.exam_name,
          course: resultGeneration.course,
          semester: resultGeneration.semester,
          resultDate: resultGeneration.result_date,
          status: resultGeneration.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update result generation');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateResultGeneration);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteResultGeneration(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteResultGeneration($id: String!) {
          deleteResultGeneration(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete result generation');
        }
        return res.data.deleteResultGeneration;
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
