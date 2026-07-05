import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Vehicle } from './vehicles.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Vehicle[]> = new BehaviorSubject<Vehicle[]>([]);
  dialogData!: Vehicle;

  get data(): Vehicle[] {
    return this.dataChange.value;
  }

  getDialogData(): Vehicle {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Vehicle {
    return new Vehicle({
      id: item.id,
      vehicle_no: item.vehicleNo || '',
      vehicle_model: item.vehicleModel || '',
      year_made: item.yearMade || '',
      driver_name: item.driverName || '',
      driver_license: item.driverLicense || '',
      vehicle_type: item.vehicleType || '',
      status: item.status || '',
      img: item.img || 'assets/images/user/user1.jpg',
    });
  }

  getVehicles(): Observable<Vehicle[]> {
    const body = {
      query: `
        query GetVehiclesList {
          vehiclesList {
            id
            vehicleNo
            vehicleModel
            yearMade
            driverName
            driverLicense
            vehicleType
            status
            img
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch vehicles');
        }
        const list = res.data.vehiclesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const body = {
      query: `
        mutation CreateVehicle($input: CreateVehicleInput!) {
          createVehicle(input: $input) {
            id
            vehicleNo
            vehicleModel
            yearMade
            driverName
            driverLicense
            vehicleType
            status
            img
          }
        }
      `,
      variables: {
        input: {
          vehicleNo: vehicle.vehicle_no,
          vehicleModel: vehicle.vehicle_model,
          yearMade: vehicle.year_made,
          driverName: vehicle.driver_name,
          driverLicense: vehicle.driver_license,
          vehicleType: vehicle.vehicle_type,
          status: vehicle.status,
          img: vehicle.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create vehicle');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createVehicle);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const body = {
      query: `
        mutation UpdateVehicle($input: UpdateVehicleInput!) {
          updateVehicle(input: $input) {
            id
            vehicleNo
            vehicleModel
            yearMade
            driverName
            driverLicense
            vehicleType
            status
            img
          }
        }
      `,
      variables: {
        input: {
          id: String(vehicle.id),
          vehicleNo: vehicle.vehicle_no,
          vehicleModel: vehicle.vehicle_model,
          yearMade: vehicle.year_made,
          driverName: vehicle.driver_name,
          driverLicense: vehicle.driver_license,
          vehicleType: vehicle.vehicle_type,
          status: vehicle.status,
          img: vehicle.img || 'assets/images/user/user1.jpg',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update vehicle');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateVehicle);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteVehicle(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteVehicle($id: String!) {
          deleteVehicle(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete vehicle');
        }
        return res.data.deleteVehicle;
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
