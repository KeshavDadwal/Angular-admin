import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UserManagement, IUserManagement } from './user-management.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private httpClient = inject(HttpClient);

  dataChange: BehaviorSubject<UserManagement[]> = new BehaviorSubject<
    UserManagement[]
  >([]);

  private staticData: IUserManagement[] = [
    {
      id: 1,
      img: 'assets/images/user/user1.jpg',
      username: 'admin_john',
      fullName: 'John Doe',
      email: 'john@example.com',
      role: 'Super Admin',
      phone: '1234567890',
      department: 'Administration',
      lastLogin: '2024-12-25 10:00',
      status: 'Active',
    },
    {
      id: 2,
      img: 'assets/images/user/user2.jpg',
      username: 'sarah_m',
      fullName: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'Admin',
      phone: '2345678901',
      department: 'Academics',
      lastLogin: '2024-12-24 15:30',
      status: 'Active',
    },
    {
      id: 3,
      img: 'assets/images/user/user3.jpg',
      username: 'mike_j',
      fullName: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Teacher',
      phone: '3456789012',
      department: 'Science',
      lastLogin: '2024-12-25 08:45',
      status: 'Active',
    },
    {
      id: 4,
      img: 'assets/images/user/user4.jpg',
      username: 'emily_d',
      fullName: 'Emily Davis',
      email: 'emily@example.com',
      role: 'Accountant',
      phone: '4567890123',
      department: 'Finance',
      lastLogin: '2024-12-23 11:20',
      status: 'Active',
    },
    {
      id: 5,
      img: 'assets/images/user/user5.jpg',
      username: 'david_w',
      fullName: 'David Wilson',
      email: 'david@example.com',
      role: 'Teacher',
      phone: '5678901234',
      department: 'Mathematics',
      lastLogin: '2024-12-25 09:15',
      status: 'Active',
    },
    {
      id: 6,
      img: 'assets/images/user/user6.jpg',
      username: 'lisa_b',
      fullName: 'Lisa Brown',
      email: 'lisa@example.com',
      role: 'Admin',
      phone: '6789012345',
      department: 'Admissions',
      lastLogin: '2024-12-24 07:00',
      status: 'Active',
    },
    {
      id: 7,
      img: 'assets/images/user/user7.jpg',
      username: 'robert_t',
      fullName: 'Robert Taylor',
      email: 'robert@example.com',
      role: 'Teacher',
      phone: '7890123456',
      department: 'Arts',
      lastLogin: '2024-12-22 14:10',
      status: 'Inactive',
    },
    {
      id: 8,
      img: 'assets/images/user/user8.jpg',
      username: 'jenn_w',
      fullName: 'Jennifer White',
      email: 'jennifer@example.com',
      role: 'Librarian',
      phone: '8901234567',
      department: 'Library',
      lastLogin: '2024-12-25 10:30',
      status: 'Active',
    },
    {
      id: 9,
      img: 'assets/images/user/user9.jpg',
      username: 'will_c',
      fullName: 'William Clark',
      email: 'william@example.com',
      role: 'IT Support',
      phone: '9012345678',
      department: 'IT',
      lastLogin: '2024-12-24 22:00',
      status: 'Active',
    },
    {
      id: 10,
      img: 'assets/images/user/user10.jpg',
      username: 'amanda_l',
      fullName: 'Amanda Lee',
      email: 'amanda@example.com',
      role: 'Registrar',
      phone: '0123456789',
      department: 'Exams',
      lastLogin: '2024-12-25 07:50',
      status: 'Active',
    },
    {
      id: 11,
      img: 'assets/images/user/user11.jpg',
      username: 'chris_m',
      fullName: 'Chris Martin',
      email: 'chris@example.com',
      role: 'Teacher',
      phone: '1122334455',
      department: 'Sports',
      lastLogin: '2024-12-21 16:25',
      status: 'Active',
    },
    {
      id: 12,
      img: 'assets/images/user/user6.jpg',
      username: 'jess_k',
      fullName: 'Jessica King',
      email: 'jessica@example.com',
      role: 'Coordinator',
      phone: '2233445566',
      department: 'Academics',
      lastLogin: '2024-12-25 09:30',
      status: 'Active',
    },
    {
      id: 13,
      img: 'assets/images/user/user1.jpg',
      username: 'matt_h',
      fullName: 'Matthew Hall',
      email: 'matthew@example.com',
      role: 'Teacher',
      phone: '3344556677',
      department: 'History',
      lastLogin: '2024-12-25 10:15',
      status: 'Active',
    },
  ];

  getAllUsers(): Observable<UserManagement[]> {
    return of(this.staticData as UserManagement[]).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  addUser(user: UserManagement): Observable<UserManagement> {
    return of(user).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  updateUser(user: UserManagement): Observable<UserManagement> {
    return of(user).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<number> {
    return of(id).pipe(
      map((_response) => id),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
