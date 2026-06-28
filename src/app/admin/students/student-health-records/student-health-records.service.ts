import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StudentHealthRecord } from './student-health-records.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentHealthRecordService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<StudentHealthRecord[]> = new BehaviorSubject<
    StudentHealthRecord[]
  >([]);

  dialogData!: StudentHealthRecord;

  // Getter for current data
  get data(): StudentHealthRecord[] {
    return this.dataChange.value;
  }

  // Getter for dialog data
  getDialogData(): StudentHealthRecord {
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

  private mapGraphQLToModel(item: any): StudentHealthRecord {
    return new StudentHealthRecord(item);
  }

  /** CRUD METHODS */

  /** GET: Fetch all student health records */
  getAllStudentHealthRecords(): Observable<StudentHealthRecord[]> {
    const body = {
      query: `
        query GetStudentHealthRecordList {
          studentHealthRecordList {
            id
            img
            student_name
            blood_group
            allergies
            last_checkup
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch student health records');
        }
        const list = res.data.studentHealthRecordList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new student health record */
  addStudentHealthRecord(
    studentHealthRecord: StudentHealthRecord
  ): Observable<StudentHealthRecord> {
    const body = {
      query: `
        mutation CreateStudentHealthRecord($input: CreateStudentHealthRecordInfoInput!) {
          createStudentHealthRecord(input: $input) {
            id
            img
            student_name
            blood_group
            allergies
            last_checkup
            status
          }
        }
      `,
      variables: {
        input: {
          img: studentHealthRecord.img || null,
          student_name: studentHealthRecord.student_name,
          blood_group: studentHealthRecord.blood_group,
          allergies: studentHealthRecord.allergies || null,
          last_checkup: this.formatDate(studentHealthRecord.last_checkup),
          status: studentHealthRecord.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create student health record');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createStudentHealthRecord);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing student health record */
  updateStudentHealthRecord(
    studentHealthRecord: StudentHealthRecord
  ): Observable<StudentHealthRecord> {
    const body = {
      query: `
        mutation UpdateStudentHealthRecord($input: UpdateStudentHealthRecordInfoInput!) {
          updateStudentHealthRecord(input: $input) {
            id
            img
            student_name
            blood_group
            allergies
            last_checkup
            status
          }
        }
      `,
      variables: {
        input: {
          id: studentHealthRecord.id,
          img: studentHealthRecord.img || null,
          student_name: studentHealthRecord.student_name,
          blood_group: studentHealthRecord.blood_group,
          allergies: studentHealthRecord.allergies || null,
          last_checkup: this.formatDate(studentHealthRecord.last_checkup),
          status: studentHealthRecord.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update student health record');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateStudentHealthRecord);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a student health record by ID */
  deleteStudentHealthRecord(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteStudentHealthRecord($id: String!) {
          deleteStudentHealthRecord(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete student health record');
        }
        return res.data.deleteStudentHealthRecord;
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
