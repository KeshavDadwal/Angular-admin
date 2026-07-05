import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Driver } from './drivers.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Driver[]> = new BehaviorSubject<Driver[]>([]);
  dialogData!: Driver;

  get data(): Driver[] {
    return this.dataChange.value;
  }

  getDialogData(): Driver {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Driver {
    return new Driver({
      id: item.id,
      driver_name: item.driverName || '',
      license_no: item.licenseNo || '',
      phone: item.phone || '',
      joining_date: item.joiningDate || '',
      address: item.address || '',
      experience: item.experience || '',
      status: item.status || '',
      img: item.img || 'assets/images/user/user1.jpg',
    });
  }

  getDrivers(): Observable<Driver[]> {
    const body = {
      query: `
        query GetDriversList {
          driversList {
            id
            driverName
            licenseNo
            phone
            joiningDate
            address
            experience
            status
            img
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch drivers');
        }
        const list = res.data.driversList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addDriver(driver: Driver): Observable<Driver> {
    const body = {
      query: `
        mutation CreateDriver($input: CreateDriverInput!) {
          createDriver(input: $input) {
            id
            driverName
            licenseNo
            phone
            joiningDate
            address
            experience
            status
            img
          }
        }
      `,
      variables: {
        input: {
          driverName: driver.driver_name,
          licenseNo: driver.license_no,
          phone: driver.phone,
          joiningDate: driver.joining_date || '',
          address: driver.address,
          experience: driver.experience,
          status: driver.status,
          img: driver.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create driver');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createDriver);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateDriver(driver: Driver): Observable<Driver> {
    const body = {
      query: `
        mutation UpdateDriver($input: UpdateDriverInput!) {
          updateDriver(input: $input) {
            id
            driverName
            licenseNo
            phone
            joiningDate
            address
            experience
            status
            img
          }
        }
      `,
      variables: {
        input: {
          id: String(driver.id),
          driverName: driver.driver_name,
          licenseNo: driver.license_no,
          phone: driver.phone,
          joiningDate: driver.joining_date || '',
          address: driver.address,
          experience: driver.experience,
          status: driver.status,
          img: driver.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update driver');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateDriver);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteDriver(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteDriver($id: String!) {
          deleteDriver(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete driver');
        }
        return res.data.deleteDriver;
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
