import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HostelRoomList } from './hostel-room-list.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HostelRoomListService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<HostelRoomList[]> = new BehaviorSubject<HostelRoomList[]>([]);
  dialogData!: HostelRoomList;

  get data(): HostelRoomList[] {
    return this.dataChange.value;
  }

  getDialogData(): HostelRoomList {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): HostelRoomList {
    return new HostelRoomList({
      roomId: item.roomId,
      roomNumber: item.roomNumber || '',
      roomType: item.roomType || '',
      floor: item.floor || 0,
      capacity: item.capacity || 1,
      occupiedStatus: item.occupiedStatus || 'Vacant',
      currentOccupants: item.currentOccupants || 0,
      priceFees: item.priceFees || 0,
      roomCondition: item.roomCondition || 'Good',
      dateAssigned: item.dateAssigned ? item.dateAssigned.split('T')[0] : '',
      roomSupervisorStaff: item.roomSupervisorStaff || '',
      hostelBlock: item.hostelBlock || '',
      checkInDate: item.checkInDate ? item.checkInDate.split('T')[0] : '',
      checkOutDate: item.checkOutDate ? item.checkOutDate.split('T')[0] : '',
      roomTypeCode: item.roomTypeCode || '',
      roomDescription: item.roomDescription || '',
    });
  }

  getHostelRooms(): Observable<HostelRoomList[]> {
    const body = {
      query: `
        query GetHostelRoomsList {
          hostelRoomsList {
            roomId
            roomNumber
            roomType
            floor
            capacity
            occupiedStatus
            currentOccupants
            priceFees
            roomCondition
            dateAssigned
            roomSupervisorStaff
            hostelBlock
            checkInDate
            checkOutDate
            roomTypeCode
            roomDescription
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch hostel rooms');
        }
        const list = res.data.hostelRoomsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addHostelRoom(hostelRoom: HostelRoomList): Observable<HostelRoomList> {
    const body = {
      query: `
        mutation CreateHostelRoom($input: CreateHostelRoomCustomInput!) {
          createHostelRoom(input: $input) {
            roomId
            roomNumber
            roomType
            floor
            capacity
            occupiedStatus
            currentOccupants
            priceFees
            roomCondition
            dateAssigned
            roomSupervisorStaff
            hostelBlock
            checkInDate
            checkOutDate
            roomTypeCode
            roomDescription
          }
        }
      `,
      variables: {
        input: {
          roomNumber: hostelRoom.roomNumber,
          roomType: hostelRoom.roomType,
          floor: Number(hostelRoom.floor),
          capacity: Number(hostelRoom.capacity),
          occupiedStatus: hostelRoom.occupiedStatus,
          currentOccupants: Number(hostelRoom.currentOccupants),
          priceFees: Number(hostelRoom.priceFees),
          roomCondition: hostelRoom.roomCondition,
          dateAssigned: hostelRoom.dateAssigned || '',
          roomSupervisorStaff: hostelRoom.roomSupervisorStaff || '',
          hostelBlock: hostelRoom.hostelBlock || '',
          checkInDate: hostelRoom.checkInDate || '',
          checkOutDate: hostelRoom.checkOutDate || '',
          roomTypeCode: hostelRoom.roomTypeCode || '',
          roomDescription: hostelRoom.roomDescription || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create hostel room');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createHostelRoom);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateHostelRoom(hostelRoom: HostelRoomList): Observable<HostelRoomList> {
    const body = {
      query: `
        mutation UpdateHostelRoom($input: UpdateHostelRoomCustomInput!) {
          updateHostelRoom(input: $input) {
            roomId
            roomNumber
            roomType
            floor
            capacity
            occupiedStatus
            currentOccupants
            priceFees
            roomCondition
            dateAssigned
            roomSupervisorStaff
            hostelBlock
            checkInDate
            checkOutDate
            roomTypeCode
            roomDescription
          }
        }
      `,
      variables: {
        input: {
          roomId: String(hostelRoom.roomId),
          roomNumber: hostelRoom.roomNumber,
          roomType: hostelRoom.roomType,
          floor: Number(hostelRoom.floor),
          capacity: Number(hostelRoom.capacity),
          occupiedStatus: hostelRoom.occupiedStatus,
          currentOccupants: Number(hostelRoom.currentOccupants),
          priceFees: Number(hostelRoom.priceFees),
          roomCondition: hostelRoom.roomCondition,
          dateAssigned: hostelRoom.dateAssigned || '',
          roomSupervisorStaff: hostelRoom.roomSupervisorStaff || '',
          hostelBlock: hostelRoom.hostelBlock || '',
          checkInDate: hostelRoom.checkInDate || '',
          checkOutDate: hostelRoom.checkOutDate || '',
          roomTypeCode: hostelRoom.roomTypeCode || '',
          roomDescription: hostelRoom.roomDescription || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update hostel room');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateHostelRoom);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteHostelRoom(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteHostelRoom($id: String!) {
          deleteHostelRoom(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete hostel room');
        }
        return res.data.deleteHostelRoom;
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
