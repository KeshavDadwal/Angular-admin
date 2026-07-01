import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Leaves } from './leaves.model';

const GQL_URL = 'http://localhost:8080/query';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  private http = inject(HttpClient);

  private mapToModel(lr: any): Leaves {
    return new Leaves({
      id: lr.id,
      img: lr.img,
      name: lr.name,
      employeeId: lr.employeeId,
      department: lr.department,
      type: lr.type,
      from: lr.from,
      leaveTo: lr.leaveTo,
      noOfDays: lr.noOfDays,
      durationType: lr.durationType,
      status: lr.status,
      reason: lr.reason,
      note: lr.note,
      requestedOn: lr.requestedOn,
      approvedBy: lr.approvedBy,
      approvalDate: lr.approvalDate,
    });
  }

  getAllLeaves(): Observable<Leaves[]> {
    const query = `{
      leaveRequests {
        id img name employeeId department type from leaveTo noOfDays durationType status reason note requestedOn approvedBy approvalDate
      }
    }`;
    return this.http.post<any>(GQL_URL, { query }).pipe(
      map((res) => res.data.leaveRequests.map((x: any) => this.mapToModel(x))),
      catchError(this.handleError)
    );
  }

  addLeaves(leaves: Leaves): Observable<Leaves> {
    const mutation = `
      mutation CreateLeaveRequest($input: CreateLeaveRequestInput!) {
        createLeaveRequest(input: $input) {
          id img name employeeId department type from leaveTo noOfDays durationType status reason note requestedOn approvedBy approvalDate
        }
      }`;
    const variables = {
      input: {
        img: leaves.img,
        name: leaves.name,
        employeeId: leaves.employeeId,
        department: leaves.department,
        type: leaves.type,
        from: leaves.from,
        leaveTo: leaves.leaveTo,
        noOfDays: leaves.noOfDays,
        durationType: leaves.durationType,
        status: leaves.status,
        reason: leaves.reason,
        note: leaves.note,
        requestedOn: leaves.requestedOn,
        approvedBy: leaves.approvedBy,
        approvalDate: leaves.approvalDate,
      },
    };
    return this.http.post<any>(GQL_URL, { query: mutation, variables }).pipe(
      map((res) => this.mapToModel(res.data.createLeaveRequest)),
      catchError(this.handleError)
    );
  }

  updateLeaves(leaves: Leaves): Observable<Leaves> {
    const mutation = `
      mutation UpdateLeaveRequest($input: UpdateLeaveRequestInput!) {
        updateLeaveRequest(input: $input) {
          id img name employeeId department type from leaveTo noOfDays durationType status reason note requestedOn approvedBy approvalDate
        }
      }`;
    const variables = {
      input: {
        id: leaves.id,
        img: leaves.img,
        name: leaves.name,
        employeeId: leaves.employeeId,
        department: leaves.department,
        type: leaves.type,
        from: leaves.from,
        leaveTo: leaves.leaveTo,
        noOfDays: leaves.noOfDays,
        durationType: leaves.durationType,
        status: leaves.status,
        reason: leaves.reason,
        note: leaves.note,
        requestedOn: leaves.requestedOn,
        approvedBy: leaves.approvedBy,
        approvalDate: leaves.approvalDate,
      },
    };
    return this.http.post<any>(GQL_URL, { query: mutation, variables }).pipe(
      map((res) => this.mapToModel(res.data.updateLeaveRequest)),
      catchError(this.handleError)
    );
  }

  deleteLeaves(id: string): Observable<string> {
    const mutation = `
      mutation DeleteLeaveRequest($id: String!) {
        deleteLeaveRequest(id: $id)
      }`;
    return this.http.post<any>(GQL_URL, { query: mutation, variables: { id } }).pipe(
      map((res) => res.data.deleteLeaveRequest as string),
      catchError(this.handleError)
    );
  }

  deleteMultipleLeaves(ids: string[]): Observable<string[]> {
    return new Observable((observer) => {
      const deletions = ids.map((id) => this.deleteLeaves(id).toPromise());
      Promise.all(deletions)
        .then(() => {
          observer.next(ids);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  private handleError(error: any) {
    console.error('LeavesService error:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
