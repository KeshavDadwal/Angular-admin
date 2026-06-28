import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { OnlineApplication } from './online-applications.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OnlineApplicationService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<OnlineApplication[]> = new BehaviorSubject<OnlineApplication[]>([]);
  dialogData!: OnlineApplication;

  get data(): OnlineApplication[] {
    return this.dataChange.value;
  }

  getDialogData(): OnlineApplication {
    return this.dialogData;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    let d: Date;
    if (date instanceof Date) {
      d = date;
    } else {
      d = new Date(date);
    }
    
    if (isNaN(d.getTime())) {
      if (typeof date === 'string') {
        return date.split('T')[0];
      }
      return String(date);
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private mapGraphQLToModel(item: any): OnlineApplication {
    return new OnlineApplication({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      student_name: item.studentName || '',
      application_no: item.applicationNo || '',
      email: item.email || '',
      mobile: item.mobile || '',
      gender: item.gender || '',
      date_of_birth: item.dateOfBirth || '',
      course: item.course || '',
      application_date: item.applicationDate || '',
      payment_status: item.paymentStatus || '',
      application_status: item.applicationStatus || ''
    });
  }

  getAllOnlineApplications(): Observable<OnlineApplication[]> {
    const body = {
      query: `
        query GetOnlineApplications {
          onlineApplications {
            id
            img
            studentName
            applicationNo
            email
            mobile
            gender
            dateOfBirth
            course
            applicationDate
            paymentStatus
            applicationStatus
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch online applications');
        }
        const list = res.data.onlineApplications || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addOnlineApplication(onlineApplication: OnlineApplication): Observable<OnlineApplication> {
    const body = {
      query: `
        mutation CreateOnlineApplication($input: CreateOnlineApplicationInput!) {
          createOnlineApplication(input: $input) {
            id
            img
            studentName
            applicationNo
            email
            mobile
            gender
            dateOfBirth
            course
            applicationDate
            paymentStatus
            applicationStatus
          }
        }
      `,
      variables: {
        input: {
          img: onlineApplication.img || 'assets/images/user/new.jpg',
          studentName: onlineApplication.student_name,
          applicationNo: onlineApplication.application_no,
          email: onlineApplication.email,
          mobile: onlineApplication.mobile,
          gender: onlineApplication.gender,
          dateOfBirth: this.formatDate(onlineApplication.date_of_birth),
          course: onlineApplication.course,
          applicationDate: this.formatDate(onlineApplication.application_date || new Date()),
          paymentStatus: onlineApplication.payment_status,
          applicationStatus: onlineApplication.application_status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create online application');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createOnlineApplication);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateOnlineApplication(onlineApplication: OnlineApplication): Observable<OnlineApplication> {
    const body = {
      query: `
        mutation UpdateOnlineApplication($input: UpdateOnlineApplicationInput!) {
          updateOnlineApplication(input: $input) {
            id
            img
            studentName
            applicationNo
            email
            mobile
            gender
            dateOfBirth
            course
            applicationDate
            paymentStatus
            applicationStatus
          }
        }
      `,
      variables: {
        input: {
          id: String(onlineApplication.id),
          img: onlineApplication.img || 'assets/images/user/new.jpg',
          studentName: onlineApplication.student_name,
          applicationNo: onlineApplication.application_no,
          email: onlineApplication.email,
          mobile: onlineApplication.mobile,
          gender: onlineApplication.gender,
          dateOfBirth: this.formatDate(onlineApplication.date_of_birth),
          course: onlineApplication.course,
          applicationDate: this.formatDate(onlineApplication.application_date),
          paymentStatus: onlineApplication.payment_status,
          applicationStatus: onlineApplication.application_status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update online application');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateOnlineApplication);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteOnlineApplication(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteOnlineApplication($id: String!) {
          deleteOnlineApplication(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete online application');
        }
        return res.data.deleteOnlineApplication;
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
