import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { CourseCurriculum } from './course-curriculum.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseCurriculumService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<CourseCurriculum[]> = new BehaviorSubject<CourseCurriculum[]>([]);
  dialogData!: CourseCurriculum;

  get data(): CourseCurriculum[] {
    return this.dataChange.value;
  }

  getDialogData(): CourseCurriculum {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): CourseCurriculum {
    return new CourseCurriculum({
      id: item.id,
      courseName: item.courseName || '',
      className: item.className || '',
      subjectName: item.subjectName || '',
      description: item.description || '',
      status: item.status || 'Active',
      duration: item.duration || '',
      referenceMaterial: item.referenceMaterial || '',
    });
  }

  getAllCurriculums(): Observable<CourseCurriculum[]> {
    const body = {
      query: `
        query GetCourseCurriculumsList {
          courseCurriculumsList {
            id
            courseName
            className
            subjectName
            description
            status
            duration
            referenceMaterial
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch course curriculums');
        }
        const list = res.data.courseCurriculumsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addCurriculum(curriculum: CourseCurriculum): Observable<CourseCurriculum> {
    const body = {
      query: `
        mutation CreateCourseCurriculum($input: CreateCourseCurriculumCustomInput!) {
          createCourseCurriculum(input: $input) {
            id
            courseName
            className
            subjectName
            description
            status
            duration
            referenceMaterial
          }
        }
      `,
      variables: {
        input: {
          courseName: curriculum.courseName,
          className: curriculum.className,
          subjectName: curriculum.subjectName,
          description: curriculum.description || '',
          status: curriculum.status,
          duration: curriculum.duration || '',
          referenceMaterial: curriculum.referenceMaterial || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create course curriculum');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createCourseCurriculum);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateCurriculum(curriculum: CourseCurriculum): Observable<CourseCurriculum> {
    const body = {
      query: `
        mutation UpdateCourseCurriculum($input: UpdateCourseCurriculumCustomInput!) {
          updateCourseCurriculum(input: $input) {
            id
            courseName
            className
            subjectName
            description
            status
            duration
            referenceMaterial
          }
        }
      `,
      variables: {
        input: {
          id: String(curriculum.id),
          courseName: curriculum.courseName,
          className: curriculum.className,
          subjectName: curriculum.subjectName,
          description: curriculum.description || '',
          status: curriculum.status,
          duration: curriculum.duration || '',
          referenceMaterial: curriculum.referenceMaterial || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update course curriculum');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateCourseCurriculum);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteCurriculum(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteCourseCurriculum($id: String!) {
          deleteCourseCurriculum(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete course curriculum');
        }
        return res.data.deleteCourseCurriculum;
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
