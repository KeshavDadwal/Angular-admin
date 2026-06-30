import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ReportCard } from './report-cards.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportCardsService {
  private httpClient = inject(HttpClient);

  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<ReportCard[]> = new BehaviorSubject<ReportCard[]>([]);
  dialogData!: ReportCard;

  get data(): ReportCard[] {
    return this.dataChange.value;
  }

  getDialogData(): ReportCard {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): ReportCard {
    return new ReportCard({
      id: item.id,
      student_name: item.studentName || '',
      roll_no: item.rollNo || '',
      exam_name: item.examName || '',
      total_marks: item.totalMarks !== undefined ? item.totalMarks : 0,
      percentage: item.percentage !== undefined ? item.percentage : 0,
      grade: item.grade || '',
      result: item.result || '',
    });
  }

  getAllReportCards(): Observable<ReportCard[]> {
    const body = {
      query: `
        query GetReportCards {
          reportCards {
            id
            studentName
            rollNo
            examName
            totalMarks
            percentage
            grade
            result
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch report cards');
        }
        const list = res.data.reportCards || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addReportCard(reportCard: ReportCard): Observable<ReportCard> {
    const body = {
      query: `
        mutation CreateReportCard($input: CreateReportCardInput!) {
          createReportCard(input: $input) {
            id
            studentName
            rollNo
            examName
            totalMarks
            percentage
            grade
            result
          }
        }
      `,
      variables: {
        input: {
          studentName: reportCard.student_name,
          rollNo: reportCard.roll_no,
          examName: reportCard.exam_name,
          totalMarks: Number(reportCard.total_marks),
          percentage: Number(reportCard.percentage),
          grade: reportCard.grade,
          result: reportCard.result,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create report card');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createReportCard);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateReportCard(reportCard: ReportCard): Observable<ReportCard> {
    const body = {
      query: `
        mutation UpdateReportCard($input: UpdateReportCardInput!) {
          updateReportCard(input: $input) {
            id
            studentName
            rollNo
            examName
            totalMarks
            percentage
            grade
            result
          }
        }
      `,
      variables: {
        input: {
          id: String(reportCard.id),
          studentName: reportCard.student_name,
          rollNo: reportCard.roll_no,
          examName: reportCard.exam_name,
          totalMarks: Number(reportCard.total_marks),
          percentage: Number(reportCard.percentage),
          grade: reportCard.grade,
          result: reportCard.result,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update report card');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateReportCard);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteReportCard(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteReportCard($id: String!) {
          deleteReportCard(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete report card');
        }
        return res.data.deleteReportCard;
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
