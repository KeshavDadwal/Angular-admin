import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AdmissionEnquiry } from './admission-enquiries.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdmissionEnquiryService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<AdmissionEnquiry[]> = new BehaviorSubject<AdmissionEnquiry[]>([]);
  dialogData!: AdmissionEnquiry;

  get data(): AdmissionEnquiry[] {
    return this.dataChange.value;
  }

  getDialogData(): AdmissionEnquiry {
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

  private mapGraphQLToModel(item: any): AdmissionEnquiry {
    return new AdmissionEnquiry({
      id: item.inquiryId,
      student_name: item.studentName || '',
      mobile: item.contactNumber || '',
      email: item.emailAddress || '',
      address: item.campusLocation || '',
      enquiry_date: item.dateOfInquiry || '',
      last_follow_up: item.preferredStartDate || '',
      next_follow_up: item.followUpDate || '',
      course: item.programOfInterest || '',
      source: item.inquirySource || '',
      assigned_to: item.assignedTo || '',
      status: item.status || '',
      note: item.notes || ''
    } as any);
  }

  /** CRUD METHODS */

  getAllAdmissionEnquiries(): Observable<AdmissionEnquiry[]> {
    const body = {
      query: `
        query GetAdmissionInquiries {
          admissionInquiries {
            inquiryId
            studentName
            guardianName
            contactNumber
            emailAddress
            dateOfInquiry
            programOfInterest
            preferredStartDate
            inquirySource
            status
            notes
            followUpDate
            assignedTo
            campusLocation
            previousEducation
            img
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch admission enquiries');
        }
        const list = res.data.admissionInquiries || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAdmissionEnquiry(admissionEnquiry: AdmissionEnquiry): Observable<AdmissionEnquiry> {
    const body = {
      query: `
        mutation CreateAdmissionInquiry($input: CreateAdmissionInquiryInput!) {
          createAdmissionInquiry(input: $input) {
            inquiryId
            studentName
            guardianName
            contactNumber
            emailAddress
            dateOfInquiry
            programOfInterest
            preferredStartDate
            inquirySource
            status
            notes
            followUpDate
            assignedTo
            campusLocation
            previousEducation
            img
          }
        }
      `,
      variables: {
        input: {
          studentName: admissionEnquiry.student_name,
          guardianName: 'Not Specified', // Default fallback for required backend field
          contactNumber: admissionEnquiry.mobile,
          emailAddress: admissionEnquiry.email || 'not.specified@example.com',
          dateOfInquiry: this.formatDate(admissionEnquiry.enquiry_date || new Date()),
          programOfInterest: admissionEnquiry.course,
          preferredStartDate: this.formatDate(admissionEnquiry.last_follow_up || admissionEnquiry.enquiry_date || new Date()),
          inquirySource: admissionEnquiry.source || 'Direct',
          status: admissionEnquiry.status || 'New',
          notes: admissionEnquiry.note || null,
          followUpDate: this.formatDate(admissionEnquiry.next_follow_up) || null,
          assignedTo: admissionEnquiry.assigned_to || null,
          campusLocation: admissionEnquiry.address || null,
          previousEducation: null,
          img: 'assets/images/user/new.jpg'
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create admission enquiry');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAdmissionInquiry);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAdmissionEnquiry(admissionEnquiry: AdmissionEnquiry): Observable<AdmissionEnquiry> {
    const body = {
      query: `
        mutation UpdateAdmissionInquiry($input: UpdateAdmissionInquiryInput!) {
          updateAdmissionInquiry(input: $input) {
            inquiryId
            studentName
            guardianName
            contactNumber
            emailAddress
            dateOfInquiry
            programOfInterest
            preferredStartDate
            inquirySource
            status
            notes
            followUpDate
            assignedTo
            campusLocation
            previousEducation
            img
          }
        }
      `,
      variables: {
        input: {
          inquiryId: String(admissionEnquiry.id),
          studentName: admissionEnquiry.student_name,
          guardianName: 'Not Specified', // Default fallback
          contactNumber: admissionEnquiry.mobile,
          emailAddress: admissionEnquiry.email || 'not.specified@example.com',
          dateOfInquiry: this.formatDate(admissionEnquiry.enquiry_date || new Date()),
          programOfInterest: admissionEnquiry.course,
          preferredStartDate: this.formatDate(admissionEnquiry.last_follow_up || admissionEnquiry.enquiry_date || new Date()),
          inquirySource: admissionEnquiry.source || 'Direct',
          status: admissionEnquiry.status || 'New',
          notes: admissionEnquiry.note || null,
          followUpDate: this.formatDate(admissionEnquiry.next_follow_up) || null,
          assignedTo: admissionEnquiry.assigned_to || null,
          campusLocation: admissionEnquiry.address || null,
          previousEducation: null,
          img: 'assets/images/user/new.jpg'
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update admission enquiry');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAdmissionInquiry);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAdmissionEnquiry(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAdmissionInquiry($inquiryId: String!) {
          deleteAdmissionInquiry(inquiryId: $inquiryId)
        }
      `,
      variables: {
        inquiryId: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete admission enquiry');
        }
        return res.data.deleteAdmissionInquiry;
      }),
      catchError(this.handleError)
    );
  }

  getAssigneeOptions(): Observable<any[]> {
    const body = {
      query: `
        query GetAssigneeOptions {
          users {
            id
            username
            role
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch assignee options');
        }
        const users = res.data.users || [];
        return users.filter((u: any) => u.role === 'admin' || u.role === 'teacher');
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
