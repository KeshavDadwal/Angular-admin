import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@core/models/interface';
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LocalStorageService } from '@shared/services';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected http = inject(HttpClient);
  private store = inject(LocalStorageService);

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
    const token = this.store.get('redstar-token');

    const result = token
      ? { status: 200, body: token }
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
