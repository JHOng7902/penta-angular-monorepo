import { Route } from '@angular/router';
import { ButtonPage } from '../pages/button/button-page';
import { CheckboxPage } from '../pages/checkbox/checkbox-page';
import { ConfirmDialogPage } from '../pages/confirm-dialog/confirm-dialog-page';
import { DialogPage } from '../pages/dialog/dialog-page';
import { InputPage } from '../pages/input/input-page';
import { RadioPage } from '../pages/radio/radio-page';
import { SelectPage } from '../pages/select/select-page';
import { TablePage } from '../pages/table/table-page';
import { NestedTablePage } from '../pages/table/nested-table/nested-table-page';
import { ToastMessagePage } from '../pages/toast-message/toast-message-page';
import { SharedUiDemo } from '../pages/shared-ui-demo/shared-ui-demo';

export const appRoutes: Route[] = [
  { path: 'button', component: ButtonPage },
  { path: 'checkbox', component: CheckboxPage },
  { path: 'dialog', component: DialogPage },
  { path: 'confirm-dialog', component: ConfirmDialogPage },
  { path: 'input', component: InputPage },
  { path: 'radio', component: RadioPage },
  { path: 'select', component: SelectPage },
  { path: 'toast', component: ToastMessagePage },
  { path: 'nested-table', component: NestedTablePage },
  { path: 'table', component: TablePage },
  { path: '', component: SharedUiDemo },
  { path: '**', redirectTo: '' },
];
