import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Teachers } from './teachers.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;
  dataChange: BehaviorSubject<Teachers[]> = new BehaviorSubject<Teachers[]>([]);
  dialogData!: Teachers;

  get data(): Teachers[] {
    return this.dataChange.value;
  }

  getDialogData(): Teachers {
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

  /** GET: Fetch all teachers */
  getAllTeachers(): Observable<Teachers[]> {
    const body = {
      query: `
        query GetTeachers {
          teachers: teachersList {
            id
            img
            name
            gender
            email
            department
            mobile
            degree
            address
            hire_date: hireDate
            salary
            subject_specialization: subjectSpecialization
            experience_years: experienceYears
            status
            birthdate
            bio
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch teachers');
        }
        const data = res.data.teachers || [];
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new teacher */
  addTeacher(teacher: Teachers): Observable<Teachers> {
    const body = {
      query: `
        mutation CreateTeacher($input: CreateTeacherInfoInput!) {
          createTeacher(input: $input) {
            id
            img
            name
            gender
            email
            department
            mobile
            degree
            address
            hire_date: hireDate
            salary
            subject_specialization: subjectSpecialization
            experience_years: experienceYears
            status
            birthdate
            bio
          }
        }
      `,
      variables: {
        input: {
          img: teacher.img || null,
          name: teacher.name,
          gender: teacher.gender,
          email: teacher.email,
          department: teacher.department,
          mobile: teacher.mobile,
          degree: teacher.degree,
          address: teacher.address,
          hireDate: this.formatDate(teacher.hire_date),
          salary: teacher.salary,
          subjectSpecialization: teacher.subject_specialization,
          experienceYears: Number(teacher.experience_years),
          status: teacher.status,
          birthdate: this.formatDate(teacher.birthdate),
          bio: teacher.bio || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create teacher');
        }
        const newTeacher = res.data.createTeacher;
        this.dialogData = newTeacher;
        return newTeacher;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing teacher */
  updateTeacher(teacher: Teachers): Observable<Teachers> {
    const body = {
      query: `
        mutation UpdateTeacher($input: UpdateTeacherInfoInput!) {
          updateTeacher(input: $input) {
            id
            img
            name
            gender
            email
            department
            mobile
            degree
            address
            hire_date: hireDate
            salary
            subject_specialization: subjectSpecialization
            experience_years: experienceYears
            status
            birthdate
            bio
          }
        }
      `,
      variables: {
        input: {
          id: teacher.id,
          img: teacher.img || null,
          name: teacher.name,
          gender: teacher.gender,
          email: teacher.email,
          department: teacher.department,
          mobile: teacher.mobile,
          degree: teacher.degree,
          address: teacher.address,
          hireDate: this.formatDate(teacher.hire_date),
          salary: teacher.salary,
          subjectSpecialization: teacher.subject_specialization,
          experienceYears: Number(teacher.experience_years),
          status: teacher.status,
          birthdate: this.formatDate(teacher.birthdate),
          bio: teacher.bio || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update teacher');
        }
        const updatedTeacher = res.data.updateTeacher;
        this.dialogData = updatedTeacher;
        return updatedTeacher;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a teacher by ID */
  deleteTeacher(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteTeacher($id: String!) {
          deleteTeacher(id: $id)
        }
      `,
      variables: {
        id: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete teacher');
        }
        return res.data.deleteTeacher;
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
