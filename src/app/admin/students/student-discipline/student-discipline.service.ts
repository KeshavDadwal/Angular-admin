import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StudentDiscipline } from './student-discipline.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentDisciplineService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<StudentDiscipline[]> = new BehaviorSubject<
    StudentDiscipline[]
  >([]);

  dialogData!: StudentDiscipline;

  // Getter for current data
  get data(): StudentDiscipline[] {
    return this.dataChange.value;
  }

  // Getter for dialog data
  getDialogData(): StudentDiscipline {
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

  private mapGraphQLToModel(item: any): StudentDiscipline {
    return new StudentDiscipline(item);
  }

  /** CRUD METHODS */

  /** GET: Fetch all student discipline records */
  getAllStudentDisciplines(): Observable<StudentDiscipline[]> {
    const body = {
      query: `
        query GetStudentDisciplineList {
          studentDisciplineList {
            id
            img
            student_name
            incident_date
            incident_type
            incident_location
            reported_by
            action_taken
            action_date
            description
            severity
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch student discipline records');
        }
        const list = res.data.studentDisciplineList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new student discipline record */
  addStudentDiscipline(
    studentDiscipline: StudentDiscipline
  ): Observable<StudentDiscipline> {
    const body = {
      query: `
        mutation CreateStudentDiscipline($input: CreateStudentDisciplineInfoInput!) {
          createStudentDiscipline(input: $input) {
            id
            img
            student_name
            incident_date
            incident_type
            incident_location
            reported_by
            action_taken
            action_date
            description
            severity
            status
          }
        }
      `,
      variables: {
        input: {
          img: studentDiscipline.img || null,
          student_name: studentDiscipline.student_name,
          incident_date: this.formatDate(studentDiscipline.incident_date),
          incident_type: studentDiscipline.incident_type,
          incident_location: studentDiscipline.incident_location,
          reported_by: studentDiscipline.reported_by,
          action_taken: studentDiscipline.action_taken || null,
          action_date: studentDiscipline.action_date ? this.formatDate(studentDiscipline.action_date) : null,
          description: studentDiscipline.description || null,
          severity: studentDiscipline.severity || null,
          status: studentDiscipline.status || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create student discipline record');
        }
        const newDiscipline = this.mapGraphQLToModel(res.data.createStudentDiscipline);
        this.dialogData = newDiscipline;
        return newDiscipline;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing student discipline record */
  updateStudentDiscipline(
    studentDiscipline: StudentDiscipline
  ): Observable<StudentDiscipline> {
    const body = {
      query: `
        mutation UpdateStudentDiscipline($input: UpdateStudentDisciplineInfoInput!) {
          updateStudentDiscipline(input: $input) {
            id
            img
            student_name
            incident_date
            incident_type
            incident_location
            reported_by
            action_taken
            action_date
            description
            severity
            status
          }
        }
      `,
      variables: {
        input: {
          id: studentDiscipline.id,
          img: studentDiscipline.img || null,
          student_name: studentDiscipline.student_name,
          incident_date: this.formatDate(studentDiscipline.incident_date),
          incident_type: studentDiscipline.incident_type,
          incident_location: studentDiscipline.incident_location,
          reported_by: studentDiscipline.reported_by,
          action_taken: studentDiscipline.action_taken || null,
          action_date: studentDiscipline.action_date ? this.formatDate(studentDiscipline.action_date) : null,
          description: studentDiscipline.description || null,
          severity: studentDiscipline.severity || null,
          status: studentDiscipline.status || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update student discipline record');
        }
        const updatedDiscipline = this.mapGraphQLToModel(res.data.updateStudentDiscipline);
        this.dialogData = updatedDiscipline;
        return updatedDiscipline;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a student discipline record by ID */
  deleteStudentDiscipline(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteStudentDiscipline($id: String!) {
          deleteStudentDiscipline(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete student discipline record');
        }
        return res.data.deleteStudentDiscipline;
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
