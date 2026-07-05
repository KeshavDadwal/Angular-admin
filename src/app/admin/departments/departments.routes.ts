import { Route } from '@angular/router';
import { AllDepartmentsComponent } from './all-departments/all-departments.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const DEPARTMENT_ROUTE: Route[] = [
  {
    path: 'all-departments',
    component: AllDepartmentsComponent,
  },
  { path: '**', component: Page404Component },
];
