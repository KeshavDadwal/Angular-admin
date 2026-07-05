import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StudentAllocation } from './student-allocation.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentAllocationService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<StudentAllocation[]> = new BehaviorSubject<StudentAllocation[]>([]);
  dialogData!: StudentAllocation;

  get data(): StudentAllocation[] {
    return this.dataChange.value;
  }

  getDialogData(): StudentAllocation {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): StudentAllocation {
    return new StudentAllocation({
      id: item.id,
      student_name: item.studentName || '',
      student_id: item.studentId || '',
      class_section: item.classSection || '',
      route_name: item.routeName || '',
      vehicle_no: item.vehicleNo || '',
      stop_point: item.stopPoint || '',
      allocation_date: item.allocationDate || '',
      status: item.status || '',
      img: item.img || 'assets/images/user/user1.jpg',
    });
  }

  getAllocations(): Observable<StudentAllocation[]> {
    const body = {
      query: `
        query GetStudentAllocationsList {
          studentAllocationsList {
            id
            studentName
            studentId
            classSection
            routeName
            vehicleNo
            stopPoint
            allocationDate
            status
            img
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch student allocations');
        }
        const list = res.data.studentAllocationsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAllocation(allocation: StudentAllocation): Observable<StudentAllocation> {
    const body = {
      query: `
        mutation CreateStudentAllocation($input: CreateStudentAllocationInput!) {
          createStudentAllocation(input: $input) {
            id
            studentName
            studentId
            classSection
            routeName
            vehicleNo
            stopPoint
            allocationDate
            status
            img
          }
        }
      `,
      variables: {
        input: {
          studentName: allocation.student_name,
          studentId: allocation.student_id,
          classSection: allocation.class_section,
          routeName: allocation.route_name,
          vehicleNo: allocation.vehicle_no,
          stopPoint: allocation.stop_point,
          allocationDate: allocation.allocation_date || '',
          status: allocation.status,
          img: allocation.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create student allocation');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createStudentAllocation);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAllocation(allocation: StudentAllocation): Observable<StudentAllocation> {
    const body = {
      query: `
        mutation UpdateStudentAllocation($input: UpdateStudentAllocationInput!) {
          updateStudentAllocation(input: $input) {
            id
            studentName
            studentId
            classSection
            routeName
            vehicleNo
            stopPoint
            allocationDate
            status
            img
          }
        }
      `,
      variables: {
        input: {
          id: String(allocation.id),
          studentName: allocation.student_name,
          studentId: allocation.student_id,
          classSection: allocation.class_section,
          routeName: allocation.route_name,
          vehicleNo: allocation.vehicle_no,
          stopPoint: allocation.stop_point,
          allocationDate: allocation.allocation_date || '',
          status: allocation.status,
          img: allocation.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update student allocation');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateStudentAllocation);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAllocation(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteStudentAllocation($id: String!) {
          deleteStudentAllocation(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete student allocation');
        }
        return res.data.deleteStudentAllocation;
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
