import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LessonPlanning } from './lesson-planning.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LessonPlanningService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<LessonPlanning[]> = new BehaviorSubject<LessonPlanning[]>([]);
  dialogData!: LessonPlanning;

  get data(): LessonPlanning[] {
    return this.dataChange.value;
  }

  getDialogData(): LessonPlanning {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): LessonPlanning {
    return new LessonPlanning({
      id: item.id,
      topicName: item.topicName || '',
      lessonName: item.lessonName || '',
      className: item.className || '',
      subjectName: item.subjectName || '',
      teacherName: item.teacherName || '',
      lessonDate: item.lessonDate ? item.lessonDate.split('T')[0] : '',
      status: item.status || 'Planned',
      objectives: item.objectives || '',
      teachingMethod: item.teachingMethod || '',
    });
  }

  getAllLessons(): Observable<LessonPlanning[]> {
    const body = {
      query: `
        query GetLessonPlanningsList {
          lessonPlanningsList {
            id
            topicName
            lessonName
            className
            subjectName
            teacherName
            lessonDate
            status
            objectives
            teachingMethod
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch lesson plannings');
        }
        const list = res.data.lessonPlanningsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addLesson(lesson: LessonPlanning): Observable<LessonPlanning> {
    const body = {
      query: `
        mutation CreateLessonPlanning($input: CreateLessonPlanningCustomInput!) {
          createLessonPlanning(input: $input) {
            id
            topicName
            lessonName
            className
            subjectName
            teacherName
            lessonDate
            status
            objectives
            teachingMethod
          }
        }
      `,
      variables: {
        input: {
          topicName: lesson.topicName,
          lessonName: lesson.lessonName,
          className: lesson.className,
          subjectName: lesson.subjectName,
          teacherName: lesson.teacherName || '',
          lessonDate: lesson.lessonDate || '',
          status: lesson.status,
          objectives: lesson.objectives || '',
          teachingMethod: lesson.teachingMethod || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create lesson planning');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createLessonPlanning);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateLesson(lesson: LessonPlanning): Observable<LessonPlanning> {
    const body = {
      query: `
        mutation UpdateLessonPlanning($input: UpdateLessonPlanningCustomInput!) {
          updateLessonPlanning(input: $input) {
            id
            topicName
            lessonName
            className
            subjectName
            teacherName
            lessonDate
            status
            objectives
            teachingMethod
          }
        }
      `,
      variables: {
        input: {
          id: String(lesson.id),
          topicName: lesson.topicName,
          lessonName: lesson.lessonName,
          className: lesson.className,
          subjectName: lesson.subjectName,
          teacherName: lesson.teacherName || '',
          lessonDate: lesson.lessonDate || '',
          status: lesson.status,
          objectives: lesson.objectives || '',
          teachingMethod: lesson.teachingMethod || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update lesson planning');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateLessonPlanning);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteLesson(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteLessonPlanning($id: String!) {
          deleteLessonPlanning(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete lesson planning');
        }
        return res.data.deleteLessonPlanning;
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
