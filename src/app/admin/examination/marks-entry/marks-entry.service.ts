import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MarksEntry } from './marks-entry.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarksEntryService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<MarksEntry[]> = new BehaviorSubject<MarksEntry[]>([]);
  dialogData!: MarksEntry;

  get data(): MarksEntry[] {
    return this.dataChange.value;
  }

  getDialogData(): MarksEntry {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): MarksEntry {
    return new MarksEntry({
      id: item.id,
      exam_name: item.examName || '',
      student_name: item.studentName || '',
      roll_no: item.rollNo || '',
      subject: item.subject || '',
      marks_obtained: item.marksObtained !== undefined ? item.marksObtained : 0,
      max_marks: item.maxMarks !== undefined ? item.maxMarks : 100,
      status: item.status || ''
    });
  }

  getAllMarksEntries(): Observable<MarksEntry[]> {
    const body = {
      query: `
        query GetMarksEntries {
          marksEntries {
            id
            examName
            studentName
            rollNo
            subject
            marksObtained
            maxMarks
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch marks entries');
        }
        const list = res.data.marksEntries || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addMarksEntry(marksEntry: MarksEntry): Observable<MarksEntry> {
    const body = {
      query: `
        mutation CreateMarksEntry($input: CreateMarksEntryInput!) {
          createMarksEntry(input: $input) {
            id
            examName
            studentName
            rollNo
            subject
            marksObtained
            maxMarks
            status
          }
        }
      `,
      variables: {
        input: {
          examName: marksEntry.exam_name,
          studentName: marksEntry.student_name,
          rollNo: marksEntry.roll_no,
          subject: marksEntry.subject,
          marksObtained: Number(marksEntry.marks_obtained),
          maxMarks: Number(marksEntry.max_marks),
          status: marksEntry.status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create marks entry record');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createMarksEntry);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateMarksEntry(marksEntry: MarksEntry): Observable<MarksEntry> {
    const body = {
      query: `
        mutation UpdateMarksEntry($input: UpdateMarksEntryInput!) {
          updateMarksEntry(input: $input) {
            id
            examName
            studentName
            rollNo
            subject
            marksObtained
            maxMarks
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(marksEntry.id),
          examName: marksEntry.exam_name,
          studentName: marksEntry.student_name,
          rollNo: marksEntry.roll_no,
          subject: marksEntry.subject,
          marksObtained: Number(marksEntry.marks_obtained),
          maxMarks: Number(marksEntry.max_marks),
          status: marksEntry.status
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update marks entry record');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateMarksEntry);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteMarksEntry(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteMarksEntry($id: String!) {
          deleteMarksEntry(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete marks entry record');
        }
        return res.data.deleteMarksEntry;
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
