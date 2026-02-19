import { Component } from '@angular/core';
import { RadioComponent, RadioGroupComponent, RadioGroupOption } from '@penta/shared-ui';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-radio-page',
  standalone: true,
  imports: [RadioComponent, RadioGroupComponent],
  templateUrl: './radio-page.html',
  styleUrl: './radio-page.scss',
})
export class RadioPage {
  basicChecked = false;
  requiredToggle = true;
  disabledToggle = true;
  groupDisabledToggle = false;
  lastEvent = 'No events yet.';

  selectedValue: unknown = 'alpha';
  lockRestricted = true;

  groupCodeSample = `<pt-ui-radio-group
  label=\"Shift\"
  [options]=\"groupOptions\"
  [value]=\"selectedValue\"
  [required]=\"requiredToggle\"
  [disabled]=\"disabledToggle\"
  [optionDisabled]=\"isOptionDisabled\"
  (valueChange)=\"selectedValue = $event\"
></pt-ui-radio-group>`;

  groupOptions: RadioGroupOption[] = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' },
    { label: 'Gamma (disabled)', value: 'gamma', disabled: true },
    { label: 'Restricted', value: 'restricted' },
  ];

  onBasicChanged(event: MatRadioChange): void {
    this.basicChecked = event.source.checked;
    this.lastEvent = `Basic selected: ${this.basicChecked}`;
  }

  onSelected(event: MatRadioChange): void {
    this.selectedValue = event.value;
    this.lastEvent = `Selected: ${event.value}`;
  }

  isOptionDisabled = (item: RadioGroupOption): boolean => {
    if (item.disabled) {
      return true;
    }
    return this.lockRestricted && item.value === 'restricted';
  };
}
