import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { NoticeBoard } from './notice-board.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NoticeBoardService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<NoticeBoard[]> = new BehaviorSubject<NoticeBoard[]>([]);
  dialogData!: NoticeBoard;

  get data(): NoticeBoard[] {
    return this.dataChange.value;
  }

  getDialogData(): NoticeBoard {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): NoticeBoard {
    return new NoticeBoard({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      title: item.title || '',
      postedBy: item.postedBy || '',
      department: item.department || '',
      date: item.date ? item.date.split('T')[0] : '',
      priority: item.priority || '',
      status: item.status || '',
      description: item.description || '',
      targetAudience: item.targetAudience || '',
    });
  }

  getAllNoticeBoards(): Observable<NoticeBoard[]> {
    const body = {
      query: `
        query GetNoticeBoardsList {
          noticeBoardsList {
            id
            img
            title
            postedBy
            department
            date
            priority
            status
            description
            targetAudience
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch notice boards');
        }
        const list = res.data.noticeBoardsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addNoticeBoard(noticeBoard: NoticeBoard): Observable<NoticeBoard> {
    const body = {
      query: `
        mutation CreateNoticeBoard($input: CreateNoticeBoardInput!) {
          createNoticeBoard(input: $input) {
            id
            img
            title
            postedBy
            department
            date
            priority
            status
            description
            targetAudience
          }
        }
      `,
      variables: {
        input: {
          img: noticeBoard.img || 'assets/images/user/new.jpg',
          title: noticeBoard.title,
          postedBy: noticeBoard.postedBy,
          department: noticeBoard.department,
          date: noticeBoard.date || '',
          priority: noticeBoard.priority,
          status: noticeBoard.status,
          description: noticeBoard.description,
          targetAudience: noticeBoard.targetAudience,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create notice board');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createNoticeBoard);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateNoticeBoard(noticeBoard: NoticeBoard): Observable<NoticeBoard> {
    const body = {
      query: `
        mutation UpdateNoticeBoard($input: UpdateNoticeBoardInput!) {
          updateNoticeBoard(input: $input) {
            id
            img
            title
            postedBy
            department
            date
            priority
            status
            description
            targetAudience
          }
        }
      `,
      variables: {
        input: {
          id: String(noticeBoard.id),
          img: noticeBoard.img || 'assets/images/user/new.jpg',
          title: noticeBoard.title,
          postedBy: noticeBoard.postedBy,
          department: noticeBoard.department,
          date: noticeBoard.date || '',
          priority: noticeBoard.priority,
          status: noticeBoard.status,
          description: noticeBoard.description,
          targetAudience: noticeBoard.targetAudience,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update notice board');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateNoticeBoard);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteNoticeBoard(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteNoticeBoard($id: String!) {
          deleteNoticeBoard(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete notice board');
        }
        return res.data.deleteNoticeBoard;
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
