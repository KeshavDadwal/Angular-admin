import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HostelRoomType } from './hostel-room-type.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HostelRoomTypeService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<HostelRoomType[]> = new BehaviorSubject<HostelRoomType[]>([]);
  dialogData!: HostelRoomType;

  get data(): HostelRoomType[] {
    return this.dataChange.value;
  }

  getDialogData(): HostelRoomType {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): HostelRoomType {
    return new HostelRoomType({
      roomTypeId: item.roomTypeId,
      roomTypeName: item.roomTypeName || '',
      capacity: item.capacity || 0,
      roomCategory: item.roomCategory || '',
      roomDescription: item.roomDescription || '',
      roomPrice: item.roomPrice || 0,
      roomFacilities: item.roomFacilities || '',
      roomArea: item.roomArea || 0,
      roomCondition: item.roomCondition || '',
      roomTypeCode: item.roomTypeCode || '',
      createdAt: item.createdAt ? item.createdAt.split('T')[0] : '',
      updatedAt: item.updatedAt ? item.updatedAt.split('T')[0] : '',
      status: item.status || '',
      maxOccupants: item.maxOccupants || 0,
    });
  }

  getHostelRoomTypes(): Observable<HostelRoomType[]> {
    const body = {
      query: `
        query GetHostelRoomTypesList {
          hostelRoomTypesList {
            roomTypeId
            roomTypeName
            capacity
            roomCategory
            roomDescription
            roomPrice
            roomFacilities
            roomArea
            roomCondition
            roomTypeCode
            createdAt
            updatedAt
            status
            maxOccupants
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch hostel room types');
        }
        const list = res.data.hostelRoomTypesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addHostelRoomType(hostelRoomType: HostelRoomType): Observable<HostelRoomType> {
    const body = {
      query: `
        mutation CreateHostelRoomType($input: CreateHostelRoomTypeCustomInput!) {
          createHostelRoomType(input: $input) {
            roomTypeId
            roomTypeName
            capacity
            roomCategory
            roomDescription
            roomPrice
            roomFacilities
            roomArea
            roomCondition
            roomTypeCode
            createdAt
            updatedAt
            status
            maxOccupants
          }
        }
      `,
      variables: {
        input: {
          roomTypeName: hostelRoomType.roomTypeName,
          capacity: Number(hostelRoomType.capacity),
          roomCategory: hostelRoomType.roomCategory || '',
          roomDescription: hostelRoomType.roomDescription || '',
          roomPrice: Number(hostelRoomType.roomPrice),
          roomFacilities: hostelRoomType.roomFacilities || '',
          roomArea: Number(hostelRoomType.roomArea),
          roomCondition: hostelRoomType.roomCondition || '',
          roomTypeCode: hostelRoomType.roomTypeCode || '',
          status: hostelRoomType.status || 'Active',
          maxOccupants: Number(hostelRoomType.maxOccupants),
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create hostel room type');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createHostelRoomType);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateHostelRoomType(hostelRoomType: HostelRoomType): Observable<HostelRoomType> {
    const body = {
      query: `
        mutation UpdateHostelRoomType($input: UpdateHostelRoomTypeCustomInput!) {
          updateHostelRoomType(input: $input) {
            roomTypeId
            roomTypeName
            capacity
            roomCategory
            roomDescription
            roomPrice
            roomFacilities
            roomArea
            roomCondition
            roomTypeCode
            createdAt
            updatedAt
            status
            maxOccupants
          }
        }
      `,
      variables: {
        input: {
          roomTypeId: String(hostelRoomType.roomTypeId),
          roomTypeName: hostelRoomType.roomTypeName,
          capacity: Number(hostelRoomType.capacity),
          roomCategory: hostelRoomType.roomCategory || '',
          roomDescription: hostelRoomType.roomDescription || '',
          roomPrice: Number(hostelRoomType.roomPrice),
          roomFacilities: hostelRoomType.roomFacilities || '',
          roomArea: Number(hostelRoomType.roomArea),
          roomCondition: hostelRoomType.roomCondition || '',
          roomTypeCode: hostelRoomType.roomTypeCode || '',
          status: hostelRoomType.status || 'Active',
          maxOccupants: Number(hostelRoomType.maxOccupants),
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update hostel room type');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateHostelRoomType);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteHostelRoomType(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteHostelRoomType($id: String!) {
          deleteHostelRoomType(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete hostel room type');
        }
        return res.data.deleteHostelRoomType;
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
