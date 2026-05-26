import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { RolePermission, PermissionModule } from './role-permission.model';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private httpClient = inject(HttpClient);

  dataChange: BehaviorSubject<RolePermission[]> = new BehaviorSubject<RolePermission[]>([]);

  private defaultModules: PermissionModule[] = [
    { module: 'Students', view: true, create: false, edit: false, delete: false },
    { module: 'Teachers', view: true, create: false, edit: false, delete: false },
    { module: 'Academics', view: true, create: false, edit: false, delete: false },
    { module: 'Finance', view: false, create: false, edit: false, delete: false },
    { module: 'Library', view: true, create: false, edit: false, delete: false },
    { module: 'Hostel', view: false, create: false, edit: false, delete: false },
    { module: 'Transport', view: false, create: false, edit: false, delete: false },
    { module: 'Settings', view: false, create: false, edit: false, delete: false },
  ];

  private staticData: RolePermission[] = [
    new RolePermission({
      id: 1, roleName: 'Super Admin', description: 'Full access to all modules', usersCount: 2, priorityLevel: 'Critical', status: 'Active',
      modules: this.defaultModules.map(m => ({ ...m, view: true, create: true, edit: true, delete: true }))
    }),
    new RolePermission({
      id: 2, roleName: 'Admin', description: 'Administrative access with some restrictions', usersCount: 5, priorityLevel: 'High', status: 'Active',
      modules: this.defaultModules.map(m => m.module === 'Settings' ? { ...m, view: true } : { ...m, view: true, create: true, edit: true })
    }),
    new RolePermission({
      id: 3, roleName: 'Teacher', description: 'Academic and student management', usersCount: 45, priorityLevel: 'Medium', status: 'Active',
      modules: this.defaultModules.map(m => ['Students', 'Academics', 'Library'].includes(m.module) ? { ...m, view: true, edit: true } : m)
    }),
    new RolePermission({
      id: 4, roleName: 'Accountant', description: 'Financial and fee management', usersCount: 3, priorityLevel: 'High', status: 'Active',
      modules: this.defaultModules.map(m => m.module === 'Finance' ? { ...m, view: true, create: true, edit: true } : m)
    }),
    new RolePermission({
      id: 5, roleName: 'Librarian', description: 'Library and books management', usersCount: 2, priorityLevel: 'Low', status: 'Active',
      modules: this.defaultModules.map(m => m.module === 'Library' ? { ...m, view: true, create: true, edit: true, delete: true } : m)
    }),
    new RolePermission({
      id: 6, roleName: 'Student', description: 'Self-service access', usersCount: 1200, priorityLevel: 'Low', status: 'Active',
      modules: this.defaultModules.map(m => ['Academics', 'Library'].includes(m.module) ? { ...m, view: true } : m)
    }),
    new RolePermission({
      id: 7, roleName: 'Parent', description: 'Ward progress monitoring', usersCount: 2000, priorityLevel: 'Low', status: 'Active',
      modules: this.defaultModules.map(m => ['Students', 'Academics'].includes(m.module) ? { ...m, view: true } : m)
    }),
    new RolePermission({
      id: 8, roleName: 'Clerk', description: 'Data entry and general assistance', usersCount: 10, priorityLevel: 'Medium', status: 'Active',
      modules: this.defaultModules.map(m => ({ ...m, view: true, create: true }))
    }),
    new RolePermission({
      id: 9, roleName: 'Receptionist', description: 'Front office management', usersCount: 2, priorityLevel: 'Low', status: 'Active',
      modules: this.defaultModules.map(m => m.module === 'Students' ? { ...m, view: true } : m)
    }),
    new RolePermission({
      id: 10, roleName: 'Guest', description: 'Limited trial access', usersCount: 0, priorityLevel: 'Low', status: 'Inactive',
      modules: this.defaultModules.map(m => ({ ...m, view: false }))
    }),
  ];

  getAllRoles(): Observable<RolePermission[]> {
    return of(this.staticData).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  addRole(role: RolePermission): Observable<RolePermission> {
    return of(role).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  updateRole(role: RolePermission): Observable<RolePermission> {
    return of(role).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  deleteRole(id: number): Observable<number> {
    return of(id).pipe(
      map((_response) => id),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
