import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Attendance } from './attendance.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Attendance[]> = new BehaviorSubject<Attendance[]>([]);
  dialogData!: Attendance;

  get data(): Attendance[] {
    return this.dataChange.value;
  }

  getDialogData(): Attendance {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Attendance {
    return new Attendance({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      student_name: item.student_name || '',
      roll_no: item.roll_no || '',
      hostel_name: item.hostel_name || '',
      room_no: item.room_no || '',
      attendance_date: item.attendance_date ? item.attendance_date.split('T')[0] : '',
      status: item.status || 'Present',
      note: item.note || '',
    });
  }

  getAllAttendance(): Observable<Attendance[]> {
    const body = {
      query: `
        query GetHostelAttendancesList {
          hostelAttendancesList {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            attendance_date
            status
            note
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch hostel attendances');
        }
        const list = res.data.hostelAttendancesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAttendance(attendance: Attendance): Observable<Attendance> {
    const body = {
      query: `
        mutation CreateHostelAttendance($input: CreateHostelAttendanceCustomInput!) {
          createHostelAttendance(input: $input) {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            attendance_date
            status
            note
          }
        }
      `,
      variables: {
        input: {
          img: attendance.img || 'assets/images/user/new.jpg',
          student_name: attendance.student_name,
          roll_no: attendance.roll_no,
          hostel_name: attendance.hostel_name,
          room_no: attendance.room_no,
          attendance_date: attendance.attendance_date || '',
          status: attendance.status,
          note: attendance.note || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create hostel attendance');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createHostelAttendance);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAttendance(attendance: Attendance): Observable<Attendance> {
    const body = {
      query: `
        mutation UpdateHostelAttendance($input: UpdateHostelAttendanceCustomInput!) {
          updateHostelAttendance(input: $input) {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            attendance_date
            status
            note
          }
        }
      `,
      variables: {
        input: {
          id: String(attendance.id),
          img: attendance.img || 'assets/images/user/new.jpg',
          student_name: attendance.student_name,
          roll_no: attendance.roll_no,
          hostel_name: attendance.hostel_name,
          room_no: attendance.room_no,
          attendance_date: attendance.attendance_date || '',
          status: attendance.status,
          note: attendance.note || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update hostel attendance');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateHostelAttendance);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAttendance(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteHostelAttendance($id: String!) {
          deleteHostelAttendance(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete hostel attendance');
        }
        return res.data.deleteHostelAttendance;
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
