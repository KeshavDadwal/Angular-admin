import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Fees } from './fees.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeesService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Fees[]> = new BehaviorSubject<Fees[]>([]);
  dialogData!: Fees;

  get data(): Fees[] {
    return this.dataChange.value;
  }

  getDialogData(): Fees {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Fees {
    return new Fees({
      id: item.id,
      rollNo: item.rollNo || '',
      studentName: item.studentName || '',
      class: item.class || 'N/A',
      feesType: item.feesType || '',
      invoiceNo: item.invoiceNo || '',
      paymentDueDate: item.paymentDueDate ? item.paymentDueDate.split('T')[0] : '',
      paymentDate: item.paymentDate ? item.paymentDate.split('T')[0] : '',
      paymentType: item.paymentType || '',
      status: item.status || '',
      amount: item.amount || '',
      lateFee: item.lateFee || '0$',
      discount: item.discount || '0$',
      createdAt: item.createdAt ? item.createdAt.split('T')[0] : '',
      updatedAt: item.updatedAt ? item.updatedAt.split('T')[0] : '',
      notes: item.notes || 'N/A',
    });
  }

  getAllFees(): Observable<Fees[]> {
    const body = {
      query: `
        query GetAllFeesList {
          allFeesList {
            id
            rollNo
            studentName
            class
            feesType
            invoiceNo
            paymentDueDate
            paymentDate
            paymentType
            status
            amount
            lateFee
            discount
            createdAt
            updatedAt
            notes
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch all fees');
        }
        const list = res.data.allFeesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addFees(fees: Fees): Observable<Fees> {
    const body = {
      query: `
        mutation CreateFees($input: CreateFeesInput!) {
          createFees(input: $input) {
            id
            rollNo
            studentName
            class
            feesType
            invoiceNo
            paymentDueDate
            paymentDate
            paymentType
            status
            amount
            lateFee
            discount
            createdAt
            updatedAt
            notes
          }
        }
      `,
      variables: {
        input: {
          rollNo: fees.rollNo,
          studentName: fees.studentName,
          class: fees.class || 'N/A',
          feesType: fees.feesType,
          invoiceNo: fees.invoiceNo,
          paymentDueDate: fees.paymentDueDate || '',
          paymentDate: fees.paymentDate || '',
          paymentType: fees.paymentType || '',
          status: fees.status,
          amount: fees.amount,
          lateFee: fees.lateFee || '0$',
          discount: fees.discount || '0$',
          createdAt: fees.createdAt || '',
          updatedAt: fees.updatedAt || '',
          notes: fees.notes || 'N/A',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create fees');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createFees);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateFees(fees: Fees): Observable<Fees> {
    const body = {
      query: `
        mutation UpdateFees($input: UpdateFeesInput!) {
          updateFees(input: $input) {
            id
            rollNo
            studentName
            class
            feesType
            invoiceNo
            paymentDueDate
            paymentDate
            paymentType
            status
            amount
            lateFee
            discount
            createdAt
            updatedAt
            notes
          }
        }
      `,
      variables: {
        input: {
          id: String(fees.id),
          rollNo: fees.rollNo,
          studentName: fees.studentName,
          class: fees.class || 'N/A',
          feesType: fees.feesType,
          invoiceNo: fees.invoiceNo,
          paymentDueDate: fees.paymentDueDate || '',
          paymentDate: fees.paymentDate || '',
          paymentType: fees.paymentType || '',
          status: fees.status,
          amount: fees.amount,
          lateFee: fees.lateFee || '0$',
          discount: fees.discount || '0$',
          createdAt: fees.createdAt || '',
          updatedAt: fees.updatedAt || '',
          notes: fees.notes || 'N/A',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update fees');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateFees);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteFees(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteFees($id: String!) {
          deleteFees(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete fees');
        }
        return res.data.deleteFees;
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
