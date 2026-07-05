import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Announcement } from './announcement.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<Announcement[]> = new BehaviorSubject<Announcement[]>([]);
  dialogData!: Announcement;

  get data(): Announcement[] {
    return this.dataChange.value;
  }

  getDialogData(): Announcement {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): Announcement {
    return new Announcement({
      id: item.id,
      img: item.img || 'assets/images/user/new.jpg',
      title: item.title || '',
      announcementType: item.announcementType || '',
      postedBy: item.postedBy || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      status: item.status || '',
      description: item.description || '',
      priority: item.priority || '',
    });
  }

  getAllAnnouncements(): Observable<Announcement[]> {
    const body = {
      query: `
        query GetAnnouncementsList {
          announcementsList {
            id
            img
            title
            announcementType
            postedBy
            startDate
            endDate
            status
            description
            priority
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch announcements');
        }
        const list = res.data.announcementsList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addAnnouncement(announcement: Announcement): Observable<Announcement> {
    const body = {
      query: `
        mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
          createAnnouncement(input: $input) {
            id
            img
            title
            announcementType
            postedBy
            startDate
            endDate
            status
            description
            priority
          }
        }
      `,
      variables: {
        input: {
          img: announcement.img || 'assets/images/user/new.jpg',
          title: announcement.title,
          announcementType: announcement.announcementType,
          postedBy: announcement.postedBy,
          startDate: announcement.startDate || '',
          endDate: announcement.endDate || '',
          status: announcement.status,
          description: announcement.description,
          priority: announcement.priority,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create announcement');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createAnnouncement);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateAnnouncement(announcement: Announcement): Observable<Announcement> {
    const body = {
      query: `
        mutation UpdateAnnouncement($input: UpdateAnnouncementInput!) {
          updateAnnouncement(input: $input) {
            id
            img
            title
            announcementType
            postedBy
            startDate
            endDate
            status
            description
            priority
          }
        }
      `,
      variables: {
        input: {
          id: String(announcement.id),
          img: announcement.img || 'assets/images/user/new.jpg',
          title: announcement.title,
          announcementType: announcement.announcementType,
          postedBy: announcement.postedBy,
          startDate: announcement.startDate || '',
          endDate: announcement.endDate || '',
          status: announcement.status,
          description: announcement.description,
          priority: announcement.priority,
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update announcement');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateAnnouncement);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteAnnouncement(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteAnnouncement($id: String!) {
          deleteAnnouncement(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete announcement');
        }
        return res.data.deleteAnnouncement;
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
