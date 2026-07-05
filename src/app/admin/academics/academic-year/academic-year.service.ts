import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AcademicYear } from './academic-year.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AcademicYearService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<AcademicYear[]> = new BehaviorSubject<AcademicYear[]>([]);
  dialogData!: AcademicYear;

  get data(): AcademicYear[] {
    return this.dataChange.value;
  }

  getDialogData(): AcademicYear {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): AcademicYear {
    return new AcademicYear({
      id: item.id,
      academicYear: item.academicYear || '',
      status: item.status || 'Active',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      description: item.description || '',
      department: item.department || 'All',
    });
  }

  getAllAcademicYears(): Observable<AcademicYear[]> {
    const body = {
      query: `
        query GetAcademicYearList {
          academicYearList {
            id
            academicYear
            status
            startDate
            endDate
            description
            department
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch academic years');
        }
        const list = res.data.academicYearList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAcademicYear(academicYear: AcademicYear): Observable<AcademicYear> {
    const body = {
      query: `
        mutation CreateAcademicYear($input: CreateAcademicYearCustomInput!) {
          createAcademicYear(input: $input) {
            id
            academicYear
            status
            startDate
            endDate
            description
            department
          }
        }
      `,
      variables: {
        input: {
          academicYear: academicYear.academicYear,
          status: academicYear.status,
          startDate: academicYear.startDate || '',
          endDate: academicYear.endDate || '',
          description: academicYear.description || '',
          department: academicYear.department || 'All',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create academic year');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAcademicYear);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAcademicYear(academicYear: AcademicYear): Observable<AcademicYear> {
    const body = {
      query: `
        mutation UpdateAcademicYear($input: UpdateAcademicYearCustomInput!) {
          updateAcademicYear(input: $input) {
            id
            academicYear
            status
            startDate
            endDate
            description
            department
          }
        }
      `,
      variables: {
        input: {
          id: String(academicYear.id),
          academicYear: academicYear.academicYear,
          status: academicYear.status,
          startDate: academicYear.startDate || '',
          endDate: academicYear.endDate || '',
          description: academicYear.description || '',
          department: academicYear.department || 'All',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update academic year');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAcademicYear);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAcademicYear(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAcademicYear($id: String!) {
          deleteAcademicYear(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete academic year');
        }
        return res.data.deleteAcademicYear;
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
