import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LeaveTypes } from './leave-types.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypesService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<LeaveTypes[]> = new BehaviorSubject<LeaveTypes[]>([]);
  dialogData!: LeaveTypes;

  get data(): LeaveTypes[] {
    return this.dataChange.value;
  }

  getDialogData(): LeaveTypes {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): LeaveTypes {
    return new LeaveTypes({
      id: item.id,
      leave_name: item.leaveName || '',
      leave_unit: item.leaveUnit || '',
      type: item.type || '',
      status: item.status || '',
      note: item.note || '',
      duration: item.duration !== undefined ? item.duration : 0,
      created_by: item.createdBy || '',
      carry_over: item.carryOver || '',
      notification_period: item.notificationPeriod || '',
      max_leaves: item.maxLeaves !== undefined ? item.maxLeaves : 0,
      annual_limit: item.annualLimit !== undefined ? item.annualLimit : 0,
    });
  }

  getAllLeaveTypes(): Observable<LeaveTypes[]> {
    const body = {
      query: `
        query GetLeaveTypesList {
          leaveTypesList {
            id
            leaveName
            leaveUnit
            type
            status
            note
            duration
            createdBy
            carryOver
            notificationPeriod
            maxLeaves
            annualLimit
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch leave types');
        }
        const list = res.data.leaveTypesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addLeaveType(leaveType: LeaveTypes): Observable<LeaveTypes> {
    const body = {
      query: `
        mutation CreateLeaveTypes($input: CreateLeaveTypesInput!) {
          createLeaveTypes(input: $input) {
            id
            leaveName
            leaveUnit
            type
            status
            note
            duration
            createdBy
            carryOver
            notificationPeriod
            maxLeaves
            annualLimit
          }
        }
      `,
      variables: {
        input: {
          leaveName: leaveType.leave_name,
          leaveUnit: leaveType.leave_unit,
          type: leaveType.type,
          status: leaveType.status,
          note: leaveType.note,
          duration: Number(leaveType.duration),
          createdBy: leaveType.created_by,
          carryOver: leaveType.carry_over,
          notificationPeriod: leaveType.notification_period,
          maxLeaves: Number(leaveType.max_leaves),
          annualLimit: Number(leaveType.annual_limit),
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create leave type');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createLeaveTypes);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateLeaveType(leaveType: LeaveTypes): Observable<LeaveTypes> {
    const body = {
      query: `
        mutation UpdateLeaveTypes($input: UpdateLeaveTypesInput!) {
          updateLeaveTypes(input: $input) {
            id
            leaveName
            leaveUnit
            type
            status
            note
            duration
            createdBy
            carryOver
            notificationPeriod
            maxLeaves
            annualLimit
          }
        }
      `,
      variables: {
        input: {
          id: String(leaveType.id),
          leaveName: leaveType.leave_name,
          leaveUnit: leaveType.leave_unit,
          type: leaveType.type,
          status: leaveType.status,
          note: leaveType.note,
          duration: Number(leaveType.duration),
          createdBy: leaveType.created_by,
          carryOver: leaveType.carry_over,
          notificationPeriod: leaveType.notification_period,
          maxLeaves: Number(leaveType.max_leaves),
          annualLimit: Number(leaveType.annual_limit),
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update leave type');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateLeaveTypes);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteLeaveType(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteLeaveTypes($id: String!) {
          deleteLeaveTypes(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete leave type');
        }
        return res.data.deleteLeaveTypes;
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
