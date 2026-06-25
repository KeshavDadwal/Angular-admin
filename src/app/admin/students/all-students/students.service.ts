import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Students } from './students.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<Students[]> = new BehaviorSubject<Students[]>([]);

  dialogData!: Students;

  // Getter for current data
  get data(): Students[] {
    return this.dataChange.value;
  }

  // Getter for dialog data
  getDialogData(): Students {
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

  private mapGraphQLToModel(item: any): Students {
    return {
      ...item,
      date_of_birth: item.dateOfBirth,
      enrollment_date: item.enrollmentDate,
      graduation_year: item.graduationYear,
      parent_guardian_name: item.parentGuardianName,
      parent_guardian_mobile: item.parentGuardianMobile,
      profile_completion_status: item.profileCompletionStatus,
      scholarship_status: item.scholarshipStatus,
    };
  }

  /** CRUD METHODS */

  /** GET: Fetch all students */
  getAllStudents(): Observable<Students[]> {
    const body = {
      query: `
        query GetStudentsList {
          studentsList {
            id
            img
            gender
            email
            department
            mobile
            name
            rollNo
            dateOfBirth
            address
            enrollmentDate
            graduationYear
            parentGuardianName
            parentGuardianMobile
            status
            profileCompletionStatus
            scholarshipStatus
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch students');
        }
        const list = res.data.studentsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new student */
  addStudent(student: Students): Observable<Students> {
    const body = {
      query: `
        mutation CreateStudent($input: CreateStudentInfoInput!) {
          createStudent(input: $input) {
            id
            img
            gender
            email
            department
            mobile
            name
            rollNo
            dateOfBirth
            address
            enrollmentDate
            graduationYear
            parentGuardianName
            parentGuardianMobile
            status
            profileCompletionStatus
            scholarshipStatus
          }
        }
      `,
      variables: {
        input: {
          img: student.img || null,
          gender: student.gender,
          email: student.email,
          department: student.department,
          mobile: student.mobile,
          name: student.name,
          rollNo: student.rollNo,
          dateOfBirth: this.formatDate(student.date_of_birth),
          address: student.address,
          enrollmentDate: this.formatDate(student.enrollment_date),
          graduationYear: student.graduation_year,
          parentGuardianName: student.parent_guardian_name,
          parentGuardianMobile: student.parent_guardian_mobile,
          status: student.status,
          profileCompletionStatus: student.profile_completion_status,
          scholarshipStatus: student.scholarship_status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create student');
        }
        const newStudent = this.mapGraphQLToModel(res.data.createStudent);
        this.dialogData = newStudent;
        return newStudent;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing student */
  updateStudent(student: Students): Observable<Students> {
    const body = {
      query: `
        mutation UpdateStudent($input: UpdateStudentInfoInput!) {
          updateStudent(input: $input) {
            id
            img
            gender
            email
            department
            mobile
            name
            rollNo
            dateOfBirth
            address
            enrollmentDate
            graduationYear
            parentGuardianName
            parentGuardianMobile
            status
            profileCompletionStatus
            scholarshipStatus
          }
        }
      `,
      variables: {
        input: {
          id: student.id,
          img: student.img || null,
          gender: student.gender,
          email: student.email,
          department: student.department,
          mobile: student.mobile,
          name: student.name,
          rollNo: student.rollNo,
          dateOfBirth: this.formatDate(student.date_of_birth),
          address: student.address,
          enrollmentDate: this.formatDate(student.enrollment_date),
          graduationYear: student.graduation_year,
          parentGuardianName: student.parent_guardian_name,
          parentGuardianMobile: student.parent_guardian_mobile,
          status: student.status,
          profileCompletionStatus: student.profile_completion_status,
          scholarshipStatus: student.scholarship_status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update student');
        }
        const updatedStudent = this.mapGraphQLToModel(res.data.updateStudent);
        this.dialogData = updatedStudent;
        return updatedStudent;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a student by ID */
  deleteStudent(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteStudent($id: String!) {
          deleteStudent(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete student');
        }
        return res.data.deleteStudent;
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
