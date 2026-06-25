import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StudentPromotion } from './student-promotion.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentPromotionService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<StudentPromotion[]> = new BehaviorSubject<
    StudentPromotion[]
  >([]);

  dialogData!: StudentPromotion;

  // Getter for current data
  get data(): StudentPromotion[] {
    return this.dataChange.value;
  }

  // Getter for dialog data
  getDialogData(): StudentPromotion {
    return this.dialogData;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return String(date);
  }

  private mapGraphQLToModel(item: any): StudentPromotion {
    return new StudentPromotion(item);
  }

  /** CRUD METHODS */

  /** GET: Fetch all student promotions */
  getAllStudentPromotions(): Observable<StudentPromotion[]> {
    const body = {
      query: `
        query GetStudentPromotionList {
          studentPromotionList {
            id
            img
            student_name
            rollNo
            current_class
            promoted_class
            section
            session
            promotion_date
            total_marks
            obtained_marks
            percentage
            result
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch student promotions');
        }
        const list = res.data.studentPromotionList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new student promotion */
  addStudentPromotion(
    studentPromotion: StudentPromotion
  ): Observable<StudentPromotion> {
    const body = {
      query: `
        mutation CreateStudentPromotion($input: CreateStudentPromotionInfoInput!) {
          createStudentPromotion(input: $input) {
            id
            img
            student_name
            rollNo
            current_class
            promoted_class
            section
            session
            promotion_date
            total_marks
            obtained_marks
            percentage
            result
            status
          }
        }
      `,
      variables: {
        input: {
          img: studentPromotion.img || null,
          student_name: studentPromotion.student_name,
          rollNo: studentPromotion.rollNo,
          current_class: studentPromotion.current_class,
          promoted_class: studentPromotion.promoted_class,
          section: studentPromotion.section,
          session: studentPromotion.session,
          promotion_date: this.formatDate(studentPromotion.promotion_date),
          total_marks: studentPromotion.total_marks || 0,
          obtained_marks: studentPromotion.obtained_marks || 0,
          percentage: studentPromotion.percentage || null,
          result: studentPromotion.result || null,
          status: studentPromotion.status || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create student promotion');
        }
        const newPromotion = this.mapGraphQLToModel(res.data.createStudentPromotion);
        this.dialogData = newPromotion;
        return newPromotion;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing student promotion */
  updateStudentPromotion(
    studentPromotion: StudentPromotion
  ): Observable<StudentPromotion> {
    const body = {
      query: `
        mutation UpdateStudentPromotion($input: UpdateStudentPromotionInfoInput!) {
          updateStudentPromotion(input: $input) {
            id
            img
            student_name
            rollNo
            current_class
            promoted_class
            section
            session
            promotion_date
            total_marks
            obtained_marks
            percentage
            result
            status
          }
        }
      `,
      variables: {
        input: {
          id: studentPromotion.id,
          img: studentPromotion.img || null,
          student_name: studentPromotion.student_name,
          rollNo: studentPromotion.rollNo,
          current_class: studentPromotion.current_class,
          promoted_class: studentPromotion.promoted_class,
          section: studentPromotion.section,
          session: studentPromotion.session,
          promotion_date: this.formatDate(studentPromotion.promotion_date),
          total_marks: studentPromotion.total_marks || 0,
          obtained_marks: studentPromotion.obtained_marks || 0,
          percentage: studentPromotion.percentage || null,
          result: studentPromotion.result || null,
          status: studentPromotion.status || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update student promotion');
        }
        const updatedPromotion = this.mapGraphQLToModel(res.data.updateStudentPromotion);
        this.dialogData = updatedPromotion;
        return updatedPromotion;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a student promotion by ID */
  deleteStudentPromotion(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteStudentPromotion($id: String!) {
          deleteStudentPromotion(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete student promotion');
        }
        return res.data.deleteStudentPromotion;
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
