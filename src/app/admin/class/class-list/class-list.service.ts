import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ClassList } from './class-list.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClassListService {
  private httpClient = inject(HttpClient);
  private readonly GRAPHQL_URL = `${environment.apiUrl}/query`;

  dataChange: BehaviorSubject<ClassList[]> = new BehaviorSubject<ClassList[]>([]);
  dialogData!: ClassList;

  get data(): ClassList[] {
    return this.dataChange.value;
  }

  getDialogData(): ClassList {
    return this.dialogData;
  }

  private mapGraphQLToModel(item: any): ClassList {
    return new ClassList({
      classId: item.classId,
      className: item.className || '',
      classCode: item.classCode || '',
      teacherId: item.teacherId || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      roomNumber: item.roomNumber || '',
      schedule: item.schedule || '',
      semester: item.semester || '',
      classCapacity: Number(item.classCapacity) || 0,
      status: item.status || 'Active',
      description: item.description || '',
      classType: item.classType || 'Regular',
      createdAt: item.createdAt ? item.createdAt.split('T')[0] : '',
      updatedAt: item.updatedAt ? item.updatedAt.split('T')[0] : '',
    });
  }

  getAllClasses(): Observable<ClassList[]> {
    const body = {
      query: `
        query GetClassList {
          classList {
            classId
            className
            classCode
            teacherId
            startDate
            endDate
            roomNumber
            schedule
            semester
            classCapacity
            status
            description
            classType
            createdAt
            updatedAt
          }
        }
      `
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to fetch class list');
        }
        const list = res.data.classList || [];
        const mappedList = list.map((item: any) => this.mapGraphQLToModel(item));
        this.dataChange.next(mappedList);
        return mappedList;
      }),
      catchError(this.handleError)
    );
  }

  addClass(newClass: ClassList): Observable<ClassList> {
    const body = {
      query: `
        mutation CreateClassList($input: CreateClassListInput!) {
          createClassList(input: $input) {
            classId
            className
            classCode
            teacherId
            startDate
            endDate
            roomNumber
            schedule
            semester
            classCapacity
            status
            description
            classType
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        input: {
          className: newClass.className,
          classCode: newClass.classCode,
          teacherId: newClass.teacherId || '',
          startDate: newClass.startDate || '',
          endDate: newClass.endDate || '',
          roomNumber: newClass.roomNumber,
          schedule: newClass.schedule || '',
          semester: newClass.semester || '',
          classCapacity: Number(newClass.classCapacity) || 0,
          status: newClass.status,
          description: newClass.description || '',
          classType: newClass.classType,
          createdAt: newClass.createdAt || '',
          updatedAt: newClass.updatedAt || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to create class');
        }
        const newRecord = this.mapGraphQLToModel(res.data.createClassList);
        this.dialogData = newRecord;
        return newRecord;
      }),
      catchError(this.handleError)
    );
  }

  updateClass(updatedClass: ClassList): Observable<ClassList> {
    const body = {
      query: `
        mutation UpdateClassList($input: UpdateClassListInput!) {
          updateClassList(input: $input) {
            classId
            className
            classCode
            teacherId
            startDate
            endDate
            roomNumber
            schedule
            semester
            classCapacity
            status
            description
            classType
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        input: {
          classId: String(updatedClass.classId),
          className: updatedClass.className,
          classCode: updatedClass.classCode,
          teacherId: updatedClass.teacherId || '',
          startDate: updatedClass.startDate || '',
          endDate: updatedClass.endDate || '',
          roomNumber: updatedClass.roomNumber,
          schedule: updatedClass.schedule || '',
          semester: updatedClass.semester || '',
          classCapacity: Number(updatedClass.classCapacity) || 0,
          status: updatedClass.status,
          description: updatedClass.description || '',
          classType: updatedClass.classType,
          createdAt: updatedClass.createdAt || '',
          updatedAt: updatedClass.updatedAt || '',
        }
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to update class');
        }
        const updatedRecord = this.mapGraphQLToModel(res.data.updateClassList);
        this.dialogData = updatedRecord;
        return updatedRecord;
      }),
      catchError(this.handleError)
    );
  }

  deleteClass(id: string | number): Observable<string> {
    const body = {
      query: `
        mutation DeleteClassList($id: String!) {
          deleteClassList(id: $id)
        }
      `,
      variables: {
        id: String(id)
      }
    };

    return this.httpClient.post<any>(this.GRAPHQL_URL, body).pipe(
      map((res: any) => {
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message || 'Failed to delete class');
        }
        return res.data.deleteClassList;
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
