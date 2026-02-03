import { Route } from '@angular/router';
import { ButtonPage } from '../pages/button/button-page';
import { InputPage } from '../pages/input/input-page';
import { TablePage } from '../pages/table/table-page';
import { NestedTablePage } from '../pages/table/nested-table/nested-table-page';
import { ToastMessagePage } from '../pages/toast-message/toast-message-page';
import { SharedUiDemo } from '../pages/shared-ui-demo/shared-ui-demo';

export const appRoutes: Route[] = [
  { path: 'button', component: ButtonPage },
  { path: 'input', component: InputPage },
  { path: 'toast', component: ToastMessagePage },
  { path: 'table/nested', component: NestedTablePage },
  { path: 'table', component: TablePage },
  { path: '', component: SharedUiDemo },
  { path: '**', redirectTo: '' },
];
