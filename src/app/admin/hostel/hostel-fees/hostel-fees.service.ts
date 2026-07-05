import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HostelFee } from './hostel-fees.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HostelFeesService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<HostelFee[]> = new BehaviorSubject<HostelFee[]>([]);
  dialogData!: HostelFee;

  get data(): HostelFee[] {
    return this.dataChange.value;
  }

  getDialogData(): HostelFee {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): HostelFee {
    return new HostelFee({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      student_name: item.student_name || '',
      roll_no: item.roll_no || '',
      hostel_name: item.hostel_name || '',
      room_no: item.room_no || '',
      fee_type: item.fee_type || '',
      amount: item.amount || 0,
      payment_date: item.payment_date ? item.payment_date.split('T')[0] : '',
      payment_status: item.payment_status || 'Paid',
    });
  }

  getAllFees(): Observable<HostelFee[]> {
    const body = {
      query: `
        query GetHostelFeesList {
          hostelFeesList {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            fee_type
            amount
            payment_date
            payment_status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch hostel fees');
        }
        const list = res.data.hostelFeesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addFee(fee: HostelFee): Observable<HostelFee> {
    const body = {
      query: `
        mutation CreateHostelFee($input: CreateHostelFeeCustomInput!) {
          createHostelFee(input: $input) {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            fee_type
            amount
            payment_date
            payment_status
          }
        }
      `,
      variables: {
        input: {
          img: fee.img || 'assets/images/user/new.jpg',
          student_name: fee.student_name,
          roll_no: fee.roll_no,
          hostel_name: fee.hostel_name,
          room_no: fee.room_no,
          fee_type: fee.fee_type,
          amount: Number(fee.amount),
          payment_date: fee.payment_date || '',
          payment_status: fee.payment_status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create hostel fee');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createHostelFee);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateFee(fee: HostelFee): Observable<HostelFee> {
    const body = {
      query: `
        mutation UpdateHostelFee($input: UpdateHostelFeeCustomInput!) {
          updateHostelFee(input: $input) {
            id
            img
            student_name
            roll_no
            hostel_name
            room_no
            fee_type
            amount
            payment_date
            payment_status
          }
        }
      `,
      variables: {
        input: {
          id: String(fee.id),
          img: fee.img || 'assets/images/user/new.jpg',
          student_name: fee.student_name,
          roll_no: fee.roll_no,
          hostel_name: fee.hostel_name,
          room_no: fee.room_no,
          fee_type: fee.fee_type,
          amount: Number(fee.amount),
          payment_date: fee.payment_date || '',
          payment_status: fee.payment_status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update hostel fee');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateHostelFee);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteFee(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteHostelFee($id: String!) {
          deleteHostelFee(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete hostel fee');
        }
        return res.data.deleteHostelFee;
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
