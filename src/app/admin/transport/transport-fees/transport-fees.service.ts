import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TransportFee } from './transport-fees.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransportFeeService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<TransportFee[]> = new BehaviorSubject<TransportFee[]>([]);
  dialogData!: TransportFee;

  get data(): TransportFee[] {
    return this.dataChange.value;
  }

  getDialogData(): TransportFee {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): TransportFee {
    return new TransportFee({
      id: item.id,
      student_name: item.studentName || '',
      student_id: item.studentId || '',
      class_section: item.classSection || '',
      route_name: item.routeName || '',
      amount: item.amount || '',
      payment_date: item.paymentDate || '',
      payment_method: item.paymentMethod || '',
      status: item.status || '',
      img: item.img || 'assets/images/user/user1.jpg',
    });
  }

  getFees(): Observable<TransportFee[]> {
    const body = {
      query: `
        query GetTransportFeesList {
          transportFeesList {
            id
            studentName
            studentId
            classSection
            routeName
            amount
            paymentDate
            paymentMethod
            status
            img
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch transport fees');
        }
        const list = res.data.transportFeesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addFee(fee: TransportFee): Observable<TransportFee> {
    const body = {
      query: `
        mutation CreateTransportFee($input: CreateTransportFeeInput!) {
          createTransportFee(input: $input) {
            id
            studentName
            studentId
            classSection
            routeName
            amount
            paymentDate
            paymentMethod
            status
            img
          }
        }
      `,
      variables: {
        input: {
          studentName: fee.student_name,
          studentId: fee.student_id,
          classSection: fee.class_section,
          routeName: fee.route_name,
          amount: fee.amount,
          paymentDate: fee.payment_date || '',
          paymentMethod: fee.payment_method,
          status: fee.status,
          img: fee.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create transport fee');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createTransportFee);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateFee(fee: TransportFee): Observable<TransportFee> {
    const body = {
      query: `
        mutation UpdateTransportFee($input: UpdateTransportFeeInput!) {
          updateTransportFee(input: $input) {
            id
            studentName
            studentId
            classSection
            routeName
            amount
            paymentDate
            paymentMethod
            status
            img
          }
        }
      `,
      variables: {
        input: {
          id: String(fee.id),
          studentName: fee.student_name,
          studentId: fee.student_id,
          classSection: fee.class_section,
          routeName: fee.route_name,
          amount: fee.amount,
          paymentDate: fee.payment_date || '',
          paymentMethod: fee.payment_method,
          status: fee.status,
          img: fee.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update transport fee');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateTransportFee);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteFee(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteTransportFee($id: String!) {
          deleteTransportFee(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete transport fee');
        }
        return res.data.deleteTransportFee;
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
