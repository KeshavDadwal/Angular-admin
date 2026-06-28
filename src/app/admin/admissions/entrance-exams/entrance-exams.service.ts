import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EntranceExam } from './entrance-exams.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EntranceExamService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<EntranceExam[]> = new BehaviorSubject<EntranceExam[]>([]);
  dialogData!: EntranceExam;

  get data(): EntranceExam[] {
    return this.dataChange.value;
  }

  getDialogData(): EntranceExam {
    return this.dialogData;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    let d: Date;
    if (date instanceof Date) {
      d = date;
    } else {
      d = new Date(date);
    }
    
    if (isNaN(d.getTime())) {
      if (typeof date === 'string') {
        return date.split('T')[0];
      }
      return String(date);
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private mapGraphQLToModel(item: any): EntranceExam {
    return new EntranceExam({
      id: item.id,
      exam_name: item.examName || '',
      exam_code: item.examCode || '',
      exam_date: item.examDate || '',
      start_time: item.startTime || '',
      end_time: item.endTime || '',
      venue: item.venue || '',
      max_marks: Number(item.maxMarks || 0),
      passing_marks: Number(item.passingMarks || 0),
      status: item.status || '',
      description: item.description || ''
    });
  }

  getAllEntranceExams(): Observable<EntranceExam[]> {
    const body = {
      query: `
        query GetEntranceExams {
          entranceExams {
            id
            examName
            examCode
            examDate
            startTime
            endTime
            venue
            maxMarks
            passingMarks
            status
            description
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch entrance exams');
        }
        const list = res.data.entranceExams || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addEntranceExam(entranceExam: EntranceExam): Observable<EntranceExam> {
    const body = {
      query: `
        mutation CreateEntranceExam($input: CreateEntranceExamInput!) {
          createEntranceExam(input: $input) {
            id
            examName
            examCode
            examDate
            startTime
            endTime
            venue
            maxMarks
            passingMarks
            status
            description
          }
        }
      `,
      variables: {
        input: {
          examName: entranceExam.exam_name,
          examCode: entranceExam.exam_code,
          examDate: this.formatDate(entranceExam.exam_date),
          startTime: entranceExam.start_time,
          endTime: entranceExam.end_time,
          venue: entranceExam.venue,
          maxMarks: Number(entranceExam.max_marks || 0),
          passingMarks: Number(entranceExam.passing_marks || 0),
          status: entranceExam.status || 'Scheduled',
          description: entranceExam.description || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create entrance exam');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createEntranceExam);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateEntranceExam(entranceExam: EntranceExam): Observable<EntranceExam> {
    const body = {
      query: `
        mutation UpdateEntranceExam($input: UpdateEntranceExamInput!) {
          updateEntranceExam(input: $input) {
            id
            examName
            examCode
            examDate
            startTime
            endTime
            venue
            maxMarks
            passingMarks
            status
            description
          }
        }
      `,
      variables: {
        input: {
          id: String(entranceExam.id),
          examName: entranceExam.exam_name,
          examCode: entranceExam.exam_code,
          examDate: this.formatDate(entranceExam.exam_date),
          startTime: entranceExam.start_time,
          endTime: entranceExam.end_time,
          venue: entranceExam.venue,
          maxMarks: Number(entranceExam.max_marks || 0),
          passingMarks: Number(entranceExam.passing_marks || 0),
          status: entranceExam.status,
          description: entranceExam.description || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update entrance exam');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateEntranceExam);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteEntranceExam(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteEntranceExam($id: String!) {
          deleteEntranceExam(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete entrance exam');
        }
        return res.data.deleteEntranceExam;
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
