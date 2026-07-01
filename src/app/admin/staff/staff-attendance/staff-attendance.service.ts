import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StaffAttendance } from './staff-attendance.model';

const GQL_URL = 'http://localhost:8080/query';

@Injectable({ providedIn: 'root' })
export class StaffAttendanceService {
  private http = inject(HttpClient);

  private mapToModel(sa: any): StaffAttendance {
    return new StaffAttendance({
      id:               sa.id,
      img:              sa.img,
      name:             sa.name,
      employee_id:      sa.employeeId,
      designation:      sa.designation,
      date:             sa.date,
      check_in:         sa.checkIn,
      break:            sa.breakTime,
      check_out:        sa.checkOut,
      total:            sa.total,
      shift:            sa.shift,
      late_arrival:     sa.lateArrival,
      early_departure:  sa.earlyDeparture,
      absence_reason:   sa.absenceReason,
      overtime:         sa.overtime,
      total_breaks:     sa.totalBreaks,
      remarks:          sa.remarks,
      attendance_status: sa.attendanceStatus,
      department:       sa.department,
    });
  }

  getAllStaffAttendances(): Observable<StaffAttendance[]> {
    const query = `{
      staffAttendanceList {
        id img name employeeId designation date
        checkIn breakTime checkOut total shift
        lateArrival earlyDeparture absenceReason overtime
        totalBreaks remarks attendanceStatus department
      }
    }`;
    return this.http.post<any>(GQL_URL, { query }).pipe(
      map((res) => res.data.staffAttendanceList.map((s: any) => this.mapToModel(s))),
      catchError(this.handleError)
    );
  }

  addStaffAttendance(sa: StaffAttendance): Observable<StaffAttendance> {
    const mutation = `
      mutation CreateStaffAttendance($input: CreateStaffAttendanceInput!) {
        createStaffAttendance(input: $input) {
          id img name employeeId designation date
          checkIn breakTime checkOut total shift
          lateArrival earlyDeparture absenceReason overtime
          totalBreaks remarks attendanceStatus department
        }
      }`;
    const variables = {
      input: {
        img:             sa.img,
        name:            sa.name,
        employeeId:      sa.employee_id,
        designation:     sa.designation,
        date:            sa.date,
        checkIn:         sa.check_in,
        breakTime:       sa.break,
        checkOut:        sa.check_out,
        total:           sa.total,
        shift:           sa.shift,
        lateArrival:     sa.late_arrival,
        earlyDeparture:  sa.early_departure,
        absenceReason:   sa.absence_reason,
        overtime:        sa.overtime,
        totalBreaks:     sa.total_breaks,
        remarks:         sa.remarks,
        attendanceStatus: sa.attendance_status,
        department:      sa.department,
      },
    };
    return this.http.post<any>(GQL_URL, { query: mutation, variables }).pipe(
      map((res) => this.mapToModel(res.data.createStaffAttendance)),
      catchError(this.handleError)
    );
  }

  updateStaffAttendance(sa: StaffAttendance): Observable<StaffAttendance> {
    const mutation = `
      mutation UpdateStaffAttendance($input: UpdateStaffAttendanceInput!) {
        updateStaffAttendance(input: $input) {
          id img name employeeId designation date
          checkIn breakTime checkOut total shift
          lateArrival earlyDeparture absenceReason overtime
          totalBreaks remarks attendanceStatus department
        }
      }`;
    const variables = {
      input: {
        id:              sa.id,
        img:             sa.img,
        name:            sa.name,
        employeeId:      sa.employee_id,
        designation:     sa.designation,
        date:            sa.date,
        checkIn:         sa.check_in,
        breakTime:       sa.break,
        checkOut:        sa.check_out,
        total:           sa.total,
        shift:           sa.shift,
        lateArrival:     sa.late_arrival,
        earlyDeparture:  sa.early_departure,
        absenceReason:   sa.absence_reason,
        overtime:        sa.overtime,
        totalBreaks:     sa.total_breaks,
        remarks:         sa.remarks,
        attendanceStatus: sa.attendance_status,
        department:      sa.department,
      },
    };
    return this.http.post<any>(GQL_URL, { query: mutation, variables }).pipe(
      map((res) => this.mapToModel(res.data.updateStaffAttendance)),
      catchError(this.handleError)
    );
  }

  deleteStaffAttendance(id: string): Observable<string> {
    const mutation = `
      mutation DeleteStaffAttendance($id: String!) {
        deleteStaffAttendance(id: $id)
      }`;
    return this.http.post<any>(GQL_URL, { query: mutation, variables: { id } }).pipe(
      map((res) => res.data.deleteStaffAttendance as string),
      catchError(this.handleError)
    );
  }

  deleteMultipleStaffAttendances(ids: string[]): Observable<string[]> {
    return new Observable((observer) => {
      const deletions = ids.map((id) => this.deleteStaffAttendance(id).toPromise());
      Promise.all(deletions)
        .then(() => { observer.next(ids); observer.complete(); })
        .catch((err) => observer.error(err));
    });
  }

  private handleError(error: any) {
    console.error('StaffAttendanceService error:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
