import { Component } from '@angular/core';
import { CheckboxComponent } from '@penta/shared-ui';
import { MatCheckboxChange } from '@angular/material/checkbox';

type CheckboxItem = {
  label: string;
  checked: boolean;
  disabled?: boolean;
};

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [CheckboxComponent],
  templateUrl: './checkbox-page.html',
  styleUrl: './checkbox-page.scss',
})
export class CheckboxPage {
  basicChecked = false;
  checkedValue = true;
  indeterminateValue = true;
  disabledValue = true;
  labelPosition: 'before' | 'after' = 'after';
  color: 'primary' | 'accent' | 'warn' = 'primary';
  disableRipple = false;
  required = false;
  lastEvent = 'No events yet.';

  allChecked = false;
  allIndeterminate = false;
  groupItems: CheckboxItem[] = [
    { label: 'Station A', checked: false },
    { label: 'Station B', checked: true },
    { label: 'Station C (disabled)', checked: false, disabled: true },
  ];

  toggleLabelPosition(event: MatCheckboxChange): void {
    this.labelPosition = event.checked ? 'before' : 'after';
    this.lastEvent = `Label position: ${this.labelPosition}`;
  }

  onBasicChanged(value: boolean): void {
    this.basicChecked = value;
    this.lastEvent = `Basic checked: ${value}`;
  }

  onChanged(event: MatCheckboxChange): void {
    this.lastEvent = `Changed: ${event.checked}`;
  }

  toggleAll(event: MatCheckboxChange): void {
    const nextValue = event.checked;
    this.groupItems = this.groupItems.map((item) =>
      item.disabled ? item : { ...item, checked: nextValue },
    );
    this.syncGroupState();
    this.lastEvent = `Select all: ${nextValue}`;
  }

  onItemChange(index: number, event: MatCheckboxChange): void {
    const item = this.groupItems[index];
    if (!item || item.disabled) {
      return;
    }
    this.groupItems[index] = { ...item, checked: event.checked };
    this.syncGroupState();
    this.lastEvent = `Item ${item.label}: ${event.checked}`;
  }

  private syncGroupState(): void {
    const selectable = this.groupItems.filter((item) => !item.disabled);
    const checkedCount = selectable.filter((item) => item.checked).length;
    this.allChecked = checkedCount > 0 && checkedCount === selectable.length;
    this.allIndeterminate =
      checkedCount > 0 && checkedCount < selectable.length;
  }
}
