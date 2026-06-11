import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@core/models/interface';
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LocalStorageService } from '@shared/services';
import { JWT } from './JWT';
import { environment } from 'environments/environment';
const jwt = new JWT();

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected http = inject(HttpClient);
  private store = inject(LocalStorageService);

  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin@123',
      name: 'Sarah Smith',
      email: 'admin@school.org',
      roles: [
        {
          name: 'ADMIN',
          priority: 1,
        },
      ],
      permissions: ['canAdd', 'canDelete', 'canEdit', 'canRead'],
      avatar: 'admin.jpg',
    },
    {
      id: 2,
      username: 'teacher',
      password: 'teacher@123',
      name: 'Ashton Cox',
      email: 'teacher@school.org',
      roles: [
        {
          name: 'TEACHER',
          priority: 2,
        },
      ],
      permissions: ['canAdd', 'canEdit', 'canRead'],
      avatar: 'teacher.jpg',
      refresh_token: true,
    },
    {
      id: 3,
      username: 'student',
      password: 'student@123',
      name: 'Cara Stevens',
      email: 'student@school.org',
      roles: [
        {
          name: 'STUDENT',
          priority: 3,
        },
      ],
      permissions: ['canRead'],
      avatar: 'student.jpg',
      refresh_token: true,
    },
  ];

  login(username: string, password: string, _rememberMe = false) {
    return this.http.post<any>(`${environment.apiUrl}/api/login`, { username, password }).pipe(
      map((res) => {
        const token = res.token;
        const role = res.role; // e.g. "admin", "teacher", "student"
        
        let uppercaseRole = 'STUDENT';
        let priority = 3;
        let name = 'Student User';
        let email = 'student@school.dev';
        let permissions = ['canRead'];
        let avatar = 'student.jpg';

        if (role === 'admin') {
          uppercaseRole = 'ADMIN';
          priority = 1;
          name = 'Sarah Smith';
          email = 'admin@school.dev';
          permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
          avatar = 'admin.jpg';
        } else if (role === 'teacher') {
          uppercaseRole = 'TEACHER';
          priority = 2;
          name = 'Ashton Cox';
          email = 'teacher@school.dev';
          permissions = ['canAdd', 'canEdit', 'canRead'];
          avatar = 'teacher.jpg';
        } else if (role === 'student') {
          uppercaseRole = 'STUDENT';
          priority = 3;
          name = 'Cara Stevens';
          email = 'student@school.dev';
          permissions = ['canRead'];
          avatar = 'student.jpg';
        }

        const currentUser = {
          id: username,
          username: username,
          name: name,
          email: email,
          roles: [
            {
              name: uppercaseRole,
              priority: priority
            }
          ],
          permissions: permissions,
          avatar: avatar
        };

        return {
          user: currentUser,
          token: token,
          status: 200
        };
      }),
      catchError((err) => {
        const errorMsg = err || 'Login failed';
        return throwError(() => errorMsg);
      })
    );
  }

  refresh() {
    const user = Object.assign({}, this.store.get('currentUser'));

    const result = user
      ? { status: 200, body: jwt.generate(user) }
      : { status: 401, body: {} };

    return of(result);
  }

  logout() {
    this.store.clear();
    return of({ success: false });
  }

  user() {
    return this.http.get<User>('/user');
  }
}
