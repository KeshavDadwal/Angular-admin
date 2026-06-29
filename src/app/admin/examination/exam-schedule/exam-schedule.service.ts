import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ExamSchedule } from './exam-schedule.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExamScheduleService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<ExamSchedule[]> = new BehaviorSubject<ExamSchedule[]>([]);
  dialogData!: ExamSchedule;

  get data(): ExamSchedule[] {
    return this.dataChange.value;
  }

  getDialogData(): ExamSchedule {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): ExamSchedule {
    return new ExamSchedule({
      id: item.id,
      exam_type: item.examType || '',
      course: item.course || '',
      semester: item.semester || '',
      subject: item.subject || '',
      exam_date: item.examDate ? item.examDate.split('T')[0] : '',
      start_time: item.startTime || '',
      end_time: item.endTime || '',
      room_no: item.roomNo || ''
    });
  }

  getAllExamSchedules(): Observable<ExamSchedule[]> {
    const body = {
      query: `
        query GetExamSchedules {
          examSchedules {
            id
            examType
            course
            semester
            subject
            examDate
            startTime
            endTime
            roomNo
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch exam schedules');
        }
        const list = res.data.examSchedules || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addExamSchedule(examSchedule: ExamSchedule): Observable<ExamSchedule> {
    const body = {
      query: `
        mutation CreateExamSchedule($input: CreateExamScheduleInput!) {
          createExamSchedule(input: $input) {
            id
            examType
            course
            semester
            subject
            examDate
            startTime
            endTime
            roomNo
          }
        }
      `,
      variables: {
        input: {
          examType: examSchedule.exam_type,
          course: examSchedule.course,
          semester: examSchedule.semester,
          subject: examSchedule.subject,
          examDate: examSchedule.exam_date,
          startTime: examSchedule.start_time,
          endTime: examSchedule.end_time,
          roomNo: examSchedule.room_no
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create exam schedule entry');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createExamSchedule);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateExamSchedule(examSchedule: ExamSchedule): Observable<ExamSchedule> {
    const body = {
      query: `
        mutation UpdateExamSchedule($input: UpdateExamScheduleInput!) {
          updateExamSchedule(input: $input) {
            id
            examType
            course
            semester
            subject
            examDate
            startTime
            endTime
            roomNo
          }
        }
      `,
      variables: {
        input: {
          id: String(examSchedule.id),
          examType: examSchedule.exam_type,
          course: examSchedule.course,
          semester: examSchedule.semester,
          subject: examSchedule.subject,
          examDate: examSchedule.exam_date,
          startTime: examSchedule.start_time,
          endTime: examSchedule.end_time,
          roomNo: examSchedule.room_no
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update exam schedule entry');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateExamSchedule);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteExamSchedule(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteExamSchedule($id: String!) {
          deleteExamSchedule(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete exam schedule entry');
        }
        return res.data.deleteExamSchedule;
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
