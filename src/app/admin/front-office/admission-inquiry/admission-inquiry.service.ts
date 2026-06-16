import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AdmissionInquiry } from './admission-inquiry.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdmissionInquiryService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<AdmissionInquiry[]> = new BehaviorSubject<
    AdmissionInquiry[]
  >([]);
  dialogData!: AdmissionInquiry;

  get data(): AdmissionInquiry[] {
    return this.dataChange.value;
  }

  getDialogData(): AdmissionInquiry {
    return this.dialogData;
  }

  /** CRUD METHODS */

  /** GET: Fetch admission inquiries */
  getAdmissionInquiries(): Observable<AdmissionInquiry[]> {
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
          throw new Error(res.errors[0].message || 'Failed to fetch admission inquiries');
        }
        const data = res.data.admissionInquiries || [];
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new admission inquiry */
  addAdmissionInquiry(
    admissionInquiry: AdmissionInquiry
  ): Observable<AdmissionInquiry> {
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
          studentName: admissionInquiry.studentName,
          guardianName: admissionInquiry.guardianName,
          contactNumber: admissionInquiry.contactNumber,
          emailAddress: admissionInquiry.emailAddress,
          dateOfInquiry: admissionInquiry.dateOfInquiry,
          programOfInterest: admissionInquiry.programOfInterest,
          preferredStartDate: admissionInquiry.preferredStartDate,
          inquirySource: admissionInquiry.inquirySource,
          status: admissionInquiry.status,
          notes: admissionInquiry.notes || null,
          followUpDate: admissionInquiry.followUpDate || null,
          assignedTo: admissionInquiry.assignedTo || null,
          campusLocation: admissionInquiry.campusLocation || null,
          previousEducation: admissionInquiry.previousEducation || null,
          img: admissionInquiry.img || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create admission inquiry');
        }
        const newInquiry = res.data.createAdmissionInquiry;
        this.dialogData = newInquiry;
        return newInquiry;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing admission inquiry */
  updateAdmissionInquiry(
    admissionInquiry: AdmissionInquiry
  ): Observable<AdmissionInquiry> {
    // Simulate updating the admission inquiry
    return of(admissionInquiry).pipe(
      map((response) => {
        this.dialogData = admissionInquiry;
        return response; // Return the updated admission inquiry
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove an admission inquiry by ID */
  deleteAdmissionInquiry(id: number): Observable<number> {
    // Simulate deleting the admission inquiry by ID
    return of(id).pipe(
      map(() => {
        return id; // Return the ID of the deleted admission inquiry
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Search admission inquiries by reference number */
  searchByReferenceNo(referenceNo: string): Observable<AdmissionInquiry[]> {
    const query = referenceNo.toLowerCase();
    const filtered = this.data.filter(
      (item) => item.studentName.toLowerCase().includes(query) ||
                item.emailAddress.toLowerCase().includes(query)
    );
    return of(filtered);
  }

  /** GET: Filter admission inquiries by status */
  filterByStatus(status: string): Observable<AdmissionInquiry[]> {
    const filtered = this.data.filter(
      (item) => item.status.toLowerCase() === status.toLowerCase()
    );
    return of(filtered);
  }

  /** GET: Filter admission inquiries by date range */
  filterByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<AdmissionInquiry[]> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const filtered = this.data.filter((item) => {
      if (!item.dateOfInquiry) return false;
      const date = new Date(item.dateOfInquiry).getTime();
      return date >= start && date <= end;
    });
    return of(filtered);
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
