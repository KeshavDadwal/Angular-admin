import { Route } from '@angular/router';
import { AllFeesComponent } from './all-fees/all-fees.component';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { FeesTypeComponent } from './fees-type/fees-type.component';
import { FeesDiscountComponent } from './fees-discount/fees-discount.component';

export const FEES_ROUTE: Route[] = [
  {
    path: 'all-fees',
    component: AllFeesComponent,
  },
  {
    path: 'fees-type',
    component: FeesTypeComponent,
  },
  {
    path: 'fees-discount',
    component: FeesDiscountComponent,
  },
  { path: '**', component: Page404Component },
];
