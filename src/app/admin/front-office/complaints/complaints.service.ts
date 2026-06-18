import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Complaints } from './complaints.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComplaintsService {
  private httpClient = inject(HttpClient);

  private readonly API_URL = 'assets/data/complaint.json';
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Complaints[]> = new BehaviorSubject<Complaints[]>(
    []
  );
  dialogData!: Complaints;

  get data(): Complaints[] {
    return this.dataChange.value;
  }

  getDialogData(): Complaints {
    return this.dialogData;
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
          throw new Error(res.errors[0].message || 'Failed to fetch assignees');
        }
        const users = res.data.users || [];
        return users.filter((u: any) => u.role === 'admin' || u.role === 'teacher');
      }),
      catchError((err) => {
        console.error('An error occurred fetching assignee options:', err);
        return throwError(() => new Error(err.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  /** CRUD METHODS */

  /** GET: Fetch all complaints */
  getComplaints(): Observable<Complaints[]> {
    const body = {
      query: `
        query GetComplaints {
          complaints {
            complaintId
            complaintDate
            complaintTime
            complainantName
            img
            complainantType
            studentName
            complaintDescription
            department
            status
            assignedTo
            resolutionDescription
            resolutionDate
            createdAt
            updatedAt
            priorityLevel
            feedback
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch complaints');
        }
        const data = res.data.complaints || [];
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new complaint */
  addComplaint(complaint: Complaints): Observable<Complaints> {
    const body = {
      query: `
        mutation CreateComplaint($input: CreateComplaintInput!) {
          createComplaint(input: $input) {
            complaintId
            complaintDate
            complaintTime
            complainantName
            img
            complainantType
            studentName
            complaintDescription
            department
            status
            assignedTo
            resolutionDescription
            resolutionDate
            createdAt
            updatedAt
            priorityLevel
            feedback
          }
        }
      `,
      variables: {
        input: {
          complaintDate: complaint.complaintDate,
          complaintTime: complaint.complaintTime,
          complainantName: complaint.complainantName,
          img: complaint.img || null,
          complainantType: complaint.complainantType,
          studentName: complaint.studentName || null,
          complaintDescription: complaint.complaintDescription,
          department: complaint.department,
          status: complaint.status,
          assignedTo: complaint.assignedTo || null,
          resolutionDescription: complaint.resolutionDescription || null,
          resolutionDate: complaint.resolutionDate || null,
          priorityLevel: complaint.priorityLevel,
          feedback: complaint.feedback || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create complaint');
        }
        const newComplaint = res.data.createComplaint;
        this.dialogData = newComplaint;
        return newComplaint;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing complaint */
  updateComplaint(complaint: Complaints): Observable<Complaints> {
    const body = {
      query: `
        mutation UpdateComplaint($input: UpdateComplaintInput!) {
          updateComplaint(input: $input) {
            complaintId
            complaintDate
            complaintTime
            complainantName
            img
            complainantType
            studentName
            complaintDescription
            department
            status
            assignedTo
            resolutionDescription
            resolutionDate
            createdAt
            updatedAt
            priorityLevel
            feedback
          }
        }
      `,
      variables: {
        input: {
          complaintId: complaint.complaintId,
          complaintDate: complaint.complaintDate,
          complaintTime: complaint.complaintTime,
          complainantName: complaint.complainantName,
          img: complaint.img || null,
          complainantType: complaint.complainantType,
          studentName: complaint.studentName || null,
          complaintDescription: complaint.complaintDescription,
          department: complaint.department,
          status: complaint.status,
          assignedTo: complaint.assignedTo || null,
          resolutionDescription: complaint.resolutionDescription || null,
          resolutionDate: complaint.resolutionDate || null,
          priorityLevel: complaint.priorityLevel,
          feedback: complaint.feedback || null
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update complaint');
        }
        const updatedComplaint = res.data.updateComplaint;
        this.dialogData = updatedComplaint;
        return updatedComplaint;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a complaint by ID */
  deleteComplaint(id: string): Observable<string> {
    const body = {
      query: `
        mutation DeleteComplaint($complaintId: String!) {
          deleteComplaint(complaintId: $complaintId)
        }
      `,
      variables: {
        complaintId: id
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete complaint');
        }
        return res.data.deleteComplaint;
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Search complaints by category */
  searchByCategory(category: string): Observable<Complaints[]> {
    const query = category.toLowerCase();
    const filtered = this.data.filter(
      (item) => item.department.toLowerCase().includes(query)
    );
    return of(filtered);
  }

  /** GET: Filter complaints by date range */
  filterByDateRange(startDate: Date, endDate: Date): Observable<Complaints[]> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const filtered = this.data.filter((item) => {
      if (!item.complaintDate) return false;
      const date = new Date(item.complaintDate).getTime();
      return date >= start && date <= end;
    });
    return of(filtered);
  }

  /** GET: Filter complaints by status */
  filterByStatus(status: string): Observable<Complaints[]> {
    const filtered = this.data.filter(
      (item) => item.status.toLowerCase() === status.toLowerCase()
    );
    return of(filtered);
  }

  /** GET: Get today's complaints */
  getTodayComplaints(): Observable<Complaints[]> {
    const today = new Date().toISOString().split('T')[0];
    const filtered = this.data.filter(
      (item) => item.complaintDate === today
    );
    return of(filtered);
  }

  /** POST: Resolve a complaint */
  resolveComplaint(
    complaintId: string,
    resolutionDetails: string
  ): Observable<Complaints> {
    const complaint = this.data.find(c => c.complaintId === complaintId);
    if (complaint) {
      complaint.resolutionDescription = resolutionDetails;
      complaint.status = 'Resolved';
      complaint.resolutionDate = new Date().toISOString().split('T')[0];
    }
    return of(complaint as Complaints);
  }

  /** Handle Http operation that failed */
  private handleError(error: any) {
    const errorMsg = error.message || error.error?.message || 'Something went wrong; please try again later.';
    console.error('An error occurred:', errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
