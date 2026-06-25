import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AssignClassTeacher, ClassInfo } from './assign-class-teacher.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssignClassTeacherService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<AssignClassTeacher[]> = new BehaviorSubject<
    AssignClassTeacher[]
  >([]);
  dialogData!: AssignClassTeacher;

  get data(): AssignClassTeacher[] {
    return this.dataChange.value;
  }

  getDialogData(): AssignClassTeacher {
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

  /** GET: Fetch all class teacher assignments */
  getClassTeacherAssignList(): Observable<AssignClassTeacher[]> {
    const body = {
      query: `
        query GetAssignClassTeacherList {
          assignClassTeacherList {
            id
            teacherId
            teacherName
            img
            classId
            className
            subject
            startDate
            endDate
            assignedBy
            assignmentStatus
            academicYear
            classTiming
            roomNumber
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch assignments');
        }
        const data = res.data.assignClassTeacherList || [];
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Fetch all available classes */
  getClassList(): Observable<ClassInfo[]> {
    const body = {
      query: `
        query GetClassList {
          classList {
            classId
            className
            classCode
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch class list');
        }
        return res.data.classList || [];
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Assign a new class teacher */
  addClassTeacherAssignment(
    assignment: AssignClassTeacher
  ): Observable<AssignClassTeacher> {
    const body = {
      query: `
        mutation CreateAssignClassTeacher($input: CreateAssignClassTeacherInput!) {
          createAssignClassTeacher(input: $input) {
            id
            teacherId
            teacherName
            img
            classId
            className
            subject
            startDate
            endDate
            assignedBy
            assignmentStatus
            academicYear
            classTiming
            roomNumber
          }
        }
      `,
      variables: {
        input: {
          teacherId: assignment.teacherId,
          teacherName: assignment.teacherName,
          img: assignment.img || null,
          classId: assignment.classId,
          className: assignment.className,
          subject: assignment.subject,
          startDate: this.formatDate(assignment.startDate),
          endDate: this.formatDate(assignment.endDate),
          assignedBy: assignment.assignedBy,
          assignmentStatus: assignment.assignmentStatus,
          academicYear: assignment.academicYear,
          classTiming: assignment.classTiming,
          roomNumber: assignment.roomNumber
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create assignment');
        }
        const newAssignment = res.data.createAssignClassTeacher;
        this.dialogData = newAssignment;
        return newAssignment;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing class teacher assignment */
  updateClassTeacherAssignment(
    assignment: AssignClassTeacher
  ): Observable<AssignClassTeacher> {
    const body = {
      query: `
        mutation UpdateAssignClassTeacher($input: UpdateAssignClassTeacherInput!) {
          updateAssignClassTeacher(input: $input) {
            id
            teacherId
            teacherName
            img
            classId
            className
            subject
            startDate
            endDate
            assignedBy
            assignmentStatus
            academicYear
            classTiming
            roomNumber
          }
        }
      `,
      variables: {
        input: {
          id: assignment.id,
          teacherId: assignment.teacherId,
          teacherName: assignment.teacherName,
          img: assignment.img || null,
          classId: assignment.classId,
          className: assignment.className,
          subject: assignment.subject,
          startDate: this.formatDate(assignment.startDate),
          endDate: this.formatDate(assignment.endDate),
          assignedBy: assignment.assignedBy,
          assignmentStatus: assignment.assignmentStatus,
          academicYear: assignment.academicYear,
          classTiming: assignment.classTiming,
          roomNumber: assignment.roomNumber
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update assignment');
        }
        const updatedAssignment = res.data.updateAssignClassTeacher;
        this.dialogData = updatedAssignment;
        return updatedAssignment;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a class teacher assignment by ID */
  deleteClassTeacherAssignment(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteAssignClassTeacher($id: String!) {
          deleteAssignClassTeacher(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete assignment');
        }
        return res.data.deleteAssignClassTeacher;
      }),
      catchError(this.handleError)
    );
  }

  getAssigneeOptions(): Observable<any[]> {
    const body = {
      query: `
        query GetAssigneeOptions {
          users {
            id
            username
            role
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch assignees');
        }
        const users = res.data.users || [];
        return users.filter((u: any) => u.role === 'admin' || u.role === 'teacher');
      }),
      catchError((err) => {
        console.error('An error occurred fetching assignee options:', err);
        return throwError(() => new Error(err.message || 'Something went wrong; please try again later.'));
      })
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
