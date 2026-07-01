import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LeaveBalance } from './leave-balance.model';

const GQL_URL = 'http://localhost:8080/query';

@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  private http = inject(HttpClient);

  private mapToModel(lb: any): LeaveBalance {
    return new LeaveBalance({
      id: lb.id,
      img: lb.img,
      name: lb.name,
      prev: lb.prev,
      current: lb.current,
      total: lb.total,
      used: lb.used,
      accepted: lb.accepted,
      rejected: lb.rejected,
      expired: lb.expired,
      carryOver: lb.carryOver,
    });
  }

  getAllLeaveBalances(): Observable<LeaveBalance[]> {
    const query = `{
      leaveBalances {
        id img name prev current total used accepted rejected expired carryOver
      }
    }`;
    return this.http.post<any>(GQL_URL, { query }).pipe(
      map((res) => res.data.leaveBalances.map((x: any) => this.mapToModel(x))),
      catchError(this.handleError)
    );
  }

  addLeaveBalance(leaveBalance: LeaveBalance): Observable<LeaveBalance> {
    const mutation = `
      mutation CreateLeaveBalance($input: CreateLeaveBalanceInput!) {
        createLeaveBalance(input: $input) {
          id img name prev current total used accepted rejected expired carryOver
        }
      }`;
    const variables = {
      input: {
        img: leaveBalance.img,
        name: leaveBalance.name,
        prev: leaveBalance.prev,
        current: leaveBalance.current,
        total: leaveBalance.total,
        used: leaveBalance.used,
        accepted: leaveBalance.accepted,
        rejected: leaveBalance.rejected,
        expired: leaveBalance.expired,
        carryOver: leaveBalance.carryOver,
      },
    };
    return this.http.post<any>(GQL_URL, { query: mutation, variables }).pipe(
      map((res) => this.mapToModel(res.data.createLeaveBalance)),
      catchError(this.handleError)
    );
  }

  updateLeaveBalance(leaveBalance: LeaveBalance): Observable<LeaveBalance> {
    const mutation = `
      mutation UpdateLeaveBalance($input: UpdateLeaveBalanceInput!) {
        updateLeaveBalance(input: $input) {
          id img name prev current total used accepted rejected expired carryOver
        }
      }`;
    const variables = {
      input: {
        id: leaveBalance.id,
        img: leaveBalance.img,
        name: leaveBalance.name,
        prev: leaveBalance.prev,
        current: leaveBalance.current,
        total: leaveBalance.total,
        used: leaveBalance.used,
        accepted: leaveBalance.accepted,
        rejected: leaveBalance.rejected,
        expired: leaveBalance.expired,
        carryOver: leaveBalance.carryOver,
      },
    };
    return this.http.post<any>(GQL_URL, { query: mutation, variables }).pipe(
      map((res) => this.mapToModel(res.data.updateLeaveBalance)),
      catchError(this.handleError)
    );
  }

  deleteLeaveBalance(id: string): Observable<string> {
    const mutation = `
      mutation DeleteLeaveBalance($id: String!) {
        deleteLeaveBalance(id: $id)
      }`;
    return this.http.post<any>(GQL_URL, { query: mutation, variables: { id } }).pipe(
      map((res) => res.data.deleteLeaveBalance as string),
      catchError(this.handleError)
    );
  }

  deleteMultipleLeaveBalances(ids: string[]): Observable<string[]> {
    return new Observable((observer) => {
      const deletions = ids.map((id) => this.deleteLeaveBalance(id).toPromise());
      Promise.all(deletions)
        .then(() => {
          observer.next(ids);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  private handleError(error: any) {
    console.error('LeaveBalanceService error:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
