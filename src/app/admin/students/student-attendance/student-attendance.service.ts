import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StudentAttendance } from './student-attendance.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentAttendanceService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<StudentAttendance[]> = new BehaviorSubject<
    StudentAttendance[]
  >([]);

  dialogData!: StudentAttendance;

  // Getter for current data
  get data(): StudentAttendance[] {
    return this.dataChange.value;
  }

  // Getter for dialog data
  getDialogData(): StudentAttendance {
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

  private mapGraphQLToModel(item: any): StudentAttendance {
    return new StudentAttendance(item);
  }

  /** CRUD METHODS */

  /** GET: Fetch all student attendances */
  getAllStudentAttendances(): Observable<StudentAttendance[]> {
    const body = {
      query: `
        query GetStudentAttendanceList {
          studentAttendanceList {
            id
            rollNo
            img
            sName
            class
            date
            status
            note
            semester
            subject
            attendance_time
            present_count
            absent_count
            reason_for_absence
            approved
            timestamp
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch student attendance');
        }
        const list = res.data.studentAttendanceList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new student attendance */
  addStudentAttendance(
    studentAttendance: StudentAttendance
  ): Observable<StudentAttendance> {
    const body = {
      query: `
        mutation CreateStudentAttendance($input: CreateStudentAttendanceInfoInput!) {
          createStudentAttendance(input: $input) {
            id
            rollNo
            img
            sName
            class
            date
            status
            note
            semester
            subject
            attendance_time
            present_count
            absent_count
            reason_for_absence
            approved
            timestamp
          }
        }
      `,
      variables: {
        input: {
          rollNo: studentAttendance.rollNo,
          img: studentAttendance.img || null,
          sName: studentAttendance.sName,
          class: studentAttendance.class,
          date: this.formatDate(studentAttendance.date),
          status: studentAttendance.status,
          note: studentAttendance.note || null,
          semester: studentAttendance.semester,
          subject: studentAttendance.subject,
          attendance_time: studentAttendance.attendance_time || null,
          present_count: studentAttendance.present_count || 0,
          absent_count: studentAttendance.absent_count || 0,
          reason_for_absence: studentAttendance.reason_for_absence || null,
          approved: studentAttendance.approved || false,
          timestamp: studentAttendance.timestamp || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create student attendance');
        }
        const newAttendance = this.mapGraphQLToModel(res.data.createStudentAttendance);
        this.dialogData = newAttendance;
        return newAttendance;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing student attendance */
  updateStudentAttendance(
    studentAttendance: StudentAttendance
  ): Observable<StudentAttendance> {
    const body = {
      query: `
        mutation UpdateStudentAttendance($input: UpdateStudentAttendanceInfoInput!) {
          updateStudentAttendance(input: $input) {
            id
            rollNo
            img
            sName
            class
            date
            status
            note
            semester
            subject
            attendance_time
            present_count
            absent_count
            reason_for_absence
            approved
            timestamp
          }
        }
      `,
      variables: {
        input: {
          id: studentAttendance.id,
          rollNo: studentAttendance.rollNo,
          img: studentAttendance.img || null,
          sName: studentAttendance.sName,
          class: studentAttendance.class,
          date: this.formatDate(studentAttendance.date),
          status: studentAttendance.status,
          note: studentAttendance.note || null,
          semester: studentAttendance.semester,
          subject: studentAttendance.subject,
          attendance_time: studentAttendance.attendance_time || null,
          present_count: studentAttendance.present_count || 0,
          absent_count: studentAttendance.absent_count || 0,
          reason_for_absence: studentAttendance.reason_for_absence || null,
          approved: studentAttendance.approved || false,
          timestamp: studentAttendance.timestamp || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update student attendance');
        }
        const updatedAttendance = this.mapGraphQLToModel(res.data.updateStudentAttendance);
        this.dialogData = updatedAttendance;
        return updatedAttendance;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a student attendance by ID */
  deleteStudentAttendance(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteStudentAttendance($id: String!) {
          deleteStudentAttendance(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete student attendance');
        }
        return res.data.deleteStudentAttendance;
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
