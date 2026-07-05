import { Route } from '@angular/router';
import { AllHolidaysComponent } from './all-holidays/all-holidays.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const HOLIDAY_ROUTE: Route[] = [
  {
    path: 'all-holidays',
    component: AllHolidaysComponent,
  },
  { path: '**', component: Page404Component },
];
