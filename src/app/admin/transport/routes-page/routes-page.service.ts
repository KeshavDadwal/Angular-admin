import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TransportRoute } from './routes-page.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransportRouteService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<TransportRoute[]> = new BehaviorSubject<TransportRoute[]>([]);
  dialogData!: TransportRoute;

  get data(): TransportRoute[] {
    return this.dataChange.value;
  }

  getDialogData(): TransportRoute {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): TransportRoute {
    return new TransportRoute({
      id: item.id,
      route_name: item.routeName || '',
      start_point: item.startPoint || '',
      end_point: item.endPoint || '',
      distance: item.distance || '',
      vehicle_no: item.vehicleNo || '',
      route_fees: item.routeFees || '',
      status: item.status || '',
    });
  }

  getRoutes(): Observable<TransportRoute[]> {
    const body = {
      query: `
        query GetTransportRoutesList {
          transportRoutesList {
            id
            routeName
            startPoint
            endPoint
            distance
            vehicleNo
            routeFees
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch transport routes');
        }
        const list = res.data.transportRoutesList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addRoute(route: TransportRoute): Observable<TransportRoute> {
    const body = {
      query: `
        mutation CreateTransportRoute($input: CreateTransportRouteInput!) {
          createTransportRoute(input: $input) {
            id
            routeName
            startPoint
            endPoint
            distance
            vehicleNo
            routeFees
            status
          }
        }
      `,
      variables: {
        input: {
          routeName: route.route_name,
          startPoint: route.start_point,
          endPoint: route.end_point,
          distance: route.distance,
          vehicleNo: route.vehicle_no,
          routeFees: route.route_fees,
          status: route.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create transport route');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createTransportRoute);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateRoute(route: TransportRoute): Observable<TransportRoute> {
    const body = {
      query: `
        mutation UpdateTransportRoute($input: UpdateTransportRouteInput!) {
          updateTransportRoute(input: $input) {
            id
            routeName
            startPoint
            endPoint
            distance
            vehicleNo
            routeFees
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(route.id),
          routeName: route.route_name,
          startPoint: route.start_point,
          endPoint: route.end_point,
          distance: route.distance,
          vehicleNo: route.vehicle_no,
          routeFees: route.route_fees,
          status: route.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update transport route');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateTransportRoute);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteRoute(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteTransportRoute($id: String!) {
          deleteTransportRoute(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete transport route');
        }
        return res.data.deleteTransportRoute;
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
