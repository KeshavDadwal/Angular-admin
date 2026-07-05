import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ExamReport } from './exam-report.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExamReportService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<ExamReport[]> = new BehaviorSubject<ExamReport[]>([]);
  dialogData!: ExamReport;

  get data(): ExamReport[] {
    return this.dataChange.value;
  }

  getDialogData(): ExamReport {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): ExamReport {
    return new ExamReport({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      examName: item.examName || '',
      className: item.className || '',
      subject: item.subject || '',
      examDate: item.examDate ? item.examDate.split('T')[0] : '',
      passPercentage: item.passPercentage || 0,
      averageMarks: item.averageMarks || 0,
      generatedBy: item.generatedBy || '',
      date: item.date ? item.date.split('T')[0] : '',
      status: item.status || '',
    });
  }

  getAllExamReports(): Observable<ExamReport[]> {
    const body = {
      query: `
        query GetExamReportsList {
          examReportsList {
            id
            img
            examName
            className
            subject
            examDate
            passPercentage
            averageMarks
            generatedBy
            date
            status
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch exam reports');
        }
        const list = res.data.examReportsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addExamReport(report: ExamReport): Observable<ExamReport> {
    const body = {
      query: `
        mutation CreateExamReport($input: CreateExamReportCustomInput!) {
          createExamReport(input: $input) {
            id
            img
            examName
            className
            subject
            examDate
            passPercentage
            averageMarks
            generatedBy
            date
            status
          }
        }
      `,
      variables: {
        input: {
          img: report.img || 'assets/images/user/new.jpg',
          examName: report.examName,
          className: report.className,
          subject: report.subject,
          examDate: report.examDate || '',
          passPercentage: Number(report.passPercentage),
          averageMarks: Number(report.averageMarks),
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create exam report');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createExamReport);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateExamReport(report: ExamReport): Observable<ExamReport> {
    const body = {
      query: `
        mutation UpdateExamReport($input: UpdateExamReportCustomInput!) {
          updateExamReport(input: $input) {
            id
            img
            examName
            className
            subject
            examDate
            passPercentage
            averageMarks
            generatedBy
            date
            status
          }
        }
      `,
      variables: {
        input: {
          id: String(report.id),
          img: report.img || 'assets/images/user/new.jpg',
          examName: report.examName,
          className: report.className,
          subject: report.subject,
          examDate: report.examDate || '',
          passPercentage: Number(report.passPercentage),
          averageMarks: Number(report.averageMarks),
          generatedBy: report.generatedBy,
          date: report.date || '',
          status: report.status,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update exam report');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateExamReport);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteExamReport(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteExamReport($id: String!) {
          deleteExamReport(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete exam report');
        }
        return res.data.deleteExamReport;
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
