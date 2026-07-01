import { Route } from '@angular/router';
import { AllstaffComponent } from './all-staff/all-staff.component';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { StaffAttendanceComponent } from './staff-attendance/staff-attendance.component';
export const STAFF_ROUTE: Route[] = [
  {
    path: 'all-staff',
    component: AllstaffComponent,
  },
  {
    path: 'staff-attendance',
    component: StaffAttendanceComponent,
  },
  { path: '**', component: Page404Component },
];
