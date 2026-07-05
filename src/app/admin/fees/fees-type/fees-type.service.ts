import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FeesType } from './fees-type.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeesTypeService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<FeesType[]> = new BehaviorSubject<FeesType[]>([]);
  dialogData!: FeesType;

  get data(): FeesType[] {
    return this.dataChange.value;
  }

  getDialogData(): FeesType {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): FeesType {
    return new FeesType({
      feeTypeId: item.feeTypeId,
      feeTypeName: item.feeTypeName || '',
      category: item.category || '',
      description: item.description || '',
      amount: Number(item.amount) || 0,
      applicableClasses: item.applicableClasses || '',
      frequency: item.frequency || '',
      status: item.status || 'Active',
      createdBy: item.createdBy || '',
      createdDate: item.createdDate ? item.createdDate.split('T')[0] : '',
      lastUpdated: item.lastUpdated ? item.lastUpdated.split('T')[0] : '',
    });
  }

  getAllFeesTypes(): Observable<FeesType[]> {
    const body = {
      query: `
        query GetFeesTypesList {
          feesTypesList {
            feeTypeId
            feeTypeName
            category
            description
            amount
            applicableClasses
            frequency
            status
            createdBy
            createdDate
            lastUpdated
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch fees types');
        }
        const list = res.data.feesTypesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addFeesType(feesType: FeesType): Observable<FeesType> {
    const body = {
      query: `
        mutation CreateFeesType($input: CreateFeesTypeInput!) {
          createFeesType(input: $input) {
            feeTypeId
            feeTypeName
            category
            description
            amount
            applicableClasses
            frequency
            status
            createdBy
            createdDate
            lastUpdated
          }
        }
      `,
      variables: {
        input: {
          feeTypeName: feesType.feeTypeName,
          category: feesType.category,
          description: feesType.description,
          amount: Number(feesType.amount),
          applicableClasses: feesType.applicableClasses,
          frequency: feesType.frequency,
          status: feesType.status,
          createdBy: feesType.createdBy,
          createdDate: feesType.createdDate || '',
          lastUpdated: feesType.lastUpdated || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create fees type');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createFeesType);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateFeesType(feesType: FeesType): Observable<FeesType> {
    const body = {
      query: `
        mutation UpdateFeesType($input: UpdateFeesTypeInput!) {
          updateFeesType(input: $input) {
            feeTypeId
            feeTypeName
            category
            description
            amount
            applicableClasses
            frequency
            status
            createdBy
            createdDate
            lastUpdated
          }
        }
      `,
      variables: {
        input: {
          feeTypeId: String(feesType.feeTypeId),
          feeTypeName: feesType.feeTypeName,
          category: feesType.category,
          description: feesType.description,
          amount: Number(feesType.amount),
          applicableClasses: feesType.applicableClasses,
          frequency: feesType.frequency,
          status: feesType.status,
          createdBy: feesType.createdBy,
          createdDate: feesType.createdDate || '',
          lastUpdated: feesType.lastUpdated || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update fees type');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateFeesType);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteFeesType(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteFeesType($id: String!) {
          deleteFeesType(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete fees type');
        }
        return res.data.deleteFeesType;
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
