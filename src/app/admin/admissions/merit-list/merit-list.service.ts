import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MeritList } from './merit-list.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeritListService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<MeritList[]> = new BehaviorSubject<MeritList[]>([]);
  dialogData!: MeritList;

  get data(): MeritList[] {
    return this.dataChange.value;
  }

  getDialogData(): MeritList {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): MeritList {
    return new MeritList({
      id: item.id,
      student_name: item.studentName || '',
      application_no: item.applicationNo || '',
      category: item.category || '',
      entrance_score: Number(item.entranceScore || 0),
      academic_score: Number(item.academicScore || 0),
      total_score: Number(item.totalScore || 0),
      rank: Number(item.rank || 0),
      course: item.course || '',
      selection_status: item.selectionStatus || ''
    });
  }

  getAllMeritLists(): Observable<MeritList[]> {
    const body = {
      query: `
        query GetMeritLists {
          meritLists {
            id
            studentName
            applicationNo
            category
            entranceScore
            academicScore
            totalScore
            rank
            course
            selectionStatus
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch merit list');
        }
        const list = res.data.meritLists || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addMeritList(meritList: MeritList): Observable<MeritList> {
    const body = {
      query: `
        mutation CreateMeritList($input: CreateMeritListInput!) {
          createMeritList(input: $input) {
            id
            studentName
            applicationNo
            category
            entranceScore
            academicScore
            totalScore
            rank
            course
            selectionStatus
          }
        }
      `,
      variables: {
        input: {
          studentName: meritList.student_name,
          applicationNo: meritList.application_no,
          category: meritList.category,
          entranceScore: Number(meritList.entrance_score || 0),
          academicScore: Number(meritList.academic_score || 0),
          totalScore: Number(meritList.total_score || 0),
          rank: Number(meritList.rank || 0),
          course: meritList.course,
          selectionStatus: meritList.selection_status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create merit list entry');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createMeritList);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateMeritList(meritList: MeritList): Observable<MeritList> {
    const body = {
      query: `
        mutation UpdateMeritList($input: UpdateMeritListInput!) {
          updateMeritList(input: $input) {
            id
            studentName
            applicationNo
            category
            entranceScore
            academicScore
            totalScore
            rank
            course
            selectionStatus
          }
        }
      `,
      variables: {
        input: {
          id: String(meritList.id),
          studentName: meritList.student_name,
          applicationNo: meritList.application_no,
          category: meritList.category,
          entranceScore: Number(meritList.entrance_score || 0),
          academicScore: Number(meritList.academic_score || 0),
          totalScore: Number(meritList.total_score || 0),
          rank: Number(meritList.rank || 0),
          course: meritList.course,
          selectionStatus: meritList.selection_status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update merit list entry');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateMeritList);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteMeritList(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteMeritList($id: String!) {
          deleteMeritList(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete merit list entry');
        }
        return res.data.deleteMeritList;
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
