import { Route } from '@angular/router';
import { AllTeachersComponent } from './all-teachers/all-teachers.component';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { AssignClassTeacherComponent } from './assign-class-teacher/assign-class-teacher.component';

export const ADMIN_TEACHER_ROUTE: Route[] = [
  {
    path: 'all-teachers',
    component: AllTeachersComponent,
  },
  {
    path: 'assign-class-teacher',
    component: AssignClassTeacherComponent,
  },
  { path: '**', component: Page404Component },
];
