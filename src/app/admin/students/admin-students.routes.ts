import { Route } from '@angular/router';
import { AllStudentsComponent } from './all-students/all-students.component';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';
import { StudentPromotionComponent } from './student-promotion/student-promotion.component';
import { StudentCertificatesComponent } from './student-certificates/student-certificates.component';
import { StudentDisciplineComponent } from './student-discipline/student-discipline.component';
import { StudentHealthRecordsComponent } from './student-health-records/student-health-records.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const ADMIN_STUDENT_ROUTE: Route[] = [
  {
    path: 'all-students',
    component: AllStudentsComponent,
  },
  {
    path: 'student-attendance',
    component: StudentAttendanceComponent,
  },
  {
    path: 'student-promotion',
    component: StudentPromotionComponent,
  },
  {
    path: 'student-certificates',
    component: StudentCertificatesComponent,
  },
  {
    path: 'student-discipline',
    component: StudentDisciplineComponent,
  },
  {
    path: 'student-health-records',
    component: StudentHealthRecordsComponent,
  },
  { path: '**', component: Page404Component },
];
