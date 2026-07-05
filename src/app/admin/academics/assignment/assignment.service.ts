import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Assignment } from './assignment.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Assignment[]> = new BehaviorSubject<Assignment[]>([]);
  dialogData!: Assignment;

  get data(): Assignment[] {
    return this.dataChange.value;
  }

  getDialogData(): Assignment {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Assignment {
    return new Assignment({
      id: item.id,
      className: item.className || '',
      subjectName: item.subjectName || '',
      teacherName: item.teacherName || '',
      assignmentDate: item.assignmentDate ? item.assignmentDate.split('T')[0] : '',
      status: item.status || 'Active',
      title: item.title || '',
      deadline: item.deadline ? item.deadline.split('T')[0] : '',
      details: item.details || '',
    });
  }

  getAllAssignments(): Observable<Assignment[]> {
    const body = {
      query: `
        query GetAssignmentsList {
          assignmentsList {
            id
            className
            subjectName
            teacherName
            assignmentDate
            status
            title
            deadline
            details
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch assignments');
        }
        const list = res.data.assignmentsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAssignment(assignment: Assignment): Observable<Assignment> {
    const body = {
      query: `
        mutation CreateAssignment($input: CreateAssignmentCustomInput!) {
          createAssignment(input: $input) {
            id
            className
            subjectName
            teacherName
            assignmentDate
            status
            title
            deadline
            details
          }
        }
      `,
      variables: {
        input: {
          className: assignment.className,
          subjectName: assignment.subjectName,
          teacherName: assignment.teacherName || '',
          assignmentDate: assignment.assignmentDate || '',
          status: assignment.status,
          title: assignment.title,
          deadline: assignment.deadline || '',
          details: assignment.details || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create assignment');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAssignment);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAssignment(assignment: Assignment): Observable<Assignment> {
    const body = {
      query: `
        mutation UpdateAssignment($input: UpdateAssignmentCustomInput!) {
          updateAssignment(input: $input) {
            id
            className
            subjectName
            teacherName
            assignmentDate
            status
            title
            deadline
            details
          }
        }
      `,
      variables: {
        input: {
          id: String(assignment.id),
          className: assignment.className,
          subjectName: assignment.subjectName,
          teacherName: assignment.teacherName || '',
          assignmentDate: assignment.assignmentDate || '',
          status: assignment.status,
          title: assignment.title,
          deadline: assignment.deadline || '',
          details: assignment.details || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update assignment');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAssignment);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAssignment(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAssignment($id: String!) {
          deleteAssignment(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete assignment');
        }
        return res.data.deleteAssignment;
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
