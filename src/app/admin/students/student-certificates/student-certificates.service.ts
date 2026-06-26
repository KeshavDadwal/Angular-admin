import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StudentCertificate } from './student-certificates.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentCertificateService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<StudentCertificate[]> = new BehaviorSubject<
    StudentCertificate[]
  >([]);

  dialogData!: StudentCertificate;

  // Getter for current data
  get data(): StudentCertificate[] {
    return this.dataChange.value;
  }

  // Getter for dialog data
  getDialogData(): StudentCertificate {
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

  private mapGraphQLToModel(item: any): StudentCertificate {
    return new StudentCertificate(item);
  }

  /** CRUD METHODS */

  /** GET: Fetch all student certificates */
  getAllStudentCertificates(): Observable<StudentCertificate[]> {
    const body = {
      query: `
        query GetStudentCertificateList {
          studentCertificateList {
            id
            img
            student_name
            certificate_type
            certificate_no
            issued_by
            issue_date
            expiry_date
            category
            description
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch student certificates');
        }
        const list = res.data.studentCertificateList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new student certificate */
  addStudentCertificate(
    studentCertificate: StudentCertificate
  ): Observable<StudentCertificate> {
    const body = {
      query: `
        mutation CreateStudentCertificate($input: CreateStudentCertificateInfoInput!) {
          createStudentCertificate(input: $input) {
            id
            img
            student_name
            certificate_type
            certificate_no
            issued_by
            issue_date
            expiry_date
            category
            description
            status
          }
        }
      `,
      variables: {
        input: {
          img: studentCertificate.img || null,
          student_name: studentCertificate.student_name,
          certificate_type: studentCertificate.certificate_type,
          certificate_no: studentCertificate.certificate_no,
          issued_by: studentCertificate.issued_by,
          issue_date: this.formatDate(studentCertificate.issue_date),
          expiry_date: this.formatDate(studentCertificate.expiry_date),
          category: studentCertificate.category || null,
          description: studentCertificate.description || null,
          status: studentCertificate.status || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create student certificate');
        }
        const newCertificate = this.mapGraphQLToModel(res.data.createStudentCertificate);
        this.dialogData = newCertificate;
        return newCertificate;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing student certificate */
  updateStudentCertificate(
    studentCertificate: StudentCertificate
  ): Observable<StudentCertificate> {
    const body = {
      query: `
        mutation UpdateStudentCertificate($input: UpdateStudentCertificateInfoInput!) {
          updateStudentCertificate(input: $input) {
            id
            img
            student_name
            certificate_type
            certificate_no
            issued_by
            issue_date
            expiry_date
            category
            description
            status
          }
        }
      `,
      variables: {
        input: {
          id: studentCertificate.id,
          img: studentCertificate.img || null,
          student_name: studentCertificate.student_name,
          certificate_type: studentCertificate.certificate_type,
          certificate_no: studentCertificate.certificate_no,
          issued_by: studentCertificate.issued_by,
          issue_date: this.formatDate(studentCertificate.issue_date),
          expiry_date: this.formatDate(studentCertificate.expiry_date),
          category: studentCertificate.category || null,
          description: studentCertificate.description || null,
          status: studentCertificate.status || null,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update student certificate');
        }
        const updatedCertificate = this.mapGraphQLToModel(res.data.updateStudentCertificate);
        this.dialogData = updatedCertificate;
        return updatedCertificate;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a student certificate by ID */
  deleteStudentCertificate(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteStudentCertificate($id: String!) {
          deleteStudentCertificate(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete student certificate');
        }
        return res.data.deleteStudentCertificate;
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
