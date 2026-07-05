import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { ClassListComponent } from './class-list/class-list.component';

export const CLASS_ROUTE: Route[] = [
  {
    path: 'class-list',
    component: ClassListComponent,
  },
  { path: '**', component: Page404Component },
];
