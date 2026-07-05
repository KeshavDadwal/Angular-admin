import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FeesDiscount } from './fees-discount.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeesDiscountService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<FeesDiscount[]> = new BehaviorSubject<FeesDiscount[]>([]);
  dialogData!: FeesDiscount;

  get data(): FeesDiscount[] {
    return this.dataChange.value;
  }

  getDialogData(): FeesDiscount {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): FeesDiscount {
    return new FeesDiscount({
      discountId: item.discountId,
      discountType: item.discountType || '',
      discountAmount: Number(item.discountAmount) || 0,
      discountPercentage: Number(item.discountPercentage) || 0,
      discountCode: item.discountCode || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      appliedDate: item.appliedDate ? item.appliedDate.split('T')[0] : '',
      status: item.status || 'Active',
      remarks: item.remarks || '',
    });
  }

  getAllFeesDiscounts(): Observable<FeesDiscount[]> {
    const body = {
      query: `
        query GetFeesDiscountsList {
          feesDiscountsList {
            discountId
            discountType
            discountAmount
            discountPercentage
            discountCode
            startDate
            endDate
            appliedDate
            status
            remarks
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch fees discounts');
        }
        const list = res.data.feesDiscountsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addFeesDiscount(feesDiscount: FeesDiscount): Observable<FeesDiscount> {
    const body = {
      query: `
        mutation CreateFeesDiscount($input: CreateFeesDiscountInput!) {
          createFeesDiscount(input: $input) {
            discountId
            discountType
            discountAmount
            discountPercentage
            discountCode
            startDate
            endDate
            appliedDate
            status
            remarks
          }
        }
      `,
      variables: {
        input: {
          discountType: feesDiscount.discountType,
          discountAmount: Number(feesDiscount.discountAmount),
          discountPercentage: Number(feesDiscount.discountPercentage),
          discountCode: feesDiscount.discountCode,
          startDate: feesDiscount.startDate || '',
          endDate: feesDiscount.endDate || '',
          appliedDate: feesDiscount.appliedDate || '',
          status: feesDiscount.status,
          remarks: feesDiscount.remarks,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create fees discount');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createFeesDiscount);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateFeesDiscount(feesDiscount: FeesDiscount): Observable<FeesDiscount> {
    const body = {
      query: `
        mutation UpdateFeesDiscount($input: UpdateFeesDiscountInput!) {
          updateFeesDiscount(input: $input) {
            discountId
            discountType
            discountAmount
            discountPercentage
            discountCode
            startDate
            endDate
            appliedDate
            status
            remarks
          }
        }
      `,
      variables: {
        input: {
          discountId: String(feesDiscount.discountId),
          discountType: feesDiscount.discountType,
          discountAmount: Number(feesDiscount.discountAmount),
          discountPercentage: Number(feesDiscount.discountPercentage),
          discountCode: feesDiscount.discountCode,
          startDate: feesDiscount.startDate || '',
          endDate: feesDiscount.endDate || '',
          appliedDate: feesDiscount.appliedDate || '',
          status: feesDiscount.status,
          remarks: feesDiscount.remarks,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update fees discount');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateFeesDiscount);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteFeesDiscount(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteFeesDiscount($id: String!) {
          deleteFeesDiscount(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete fees discount');
        }
        return res.data.deleteFeesDiscount;
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
