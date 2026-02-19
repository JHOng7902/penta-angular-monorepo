import { Component } from '@angular/core';
import { SelectComponent, SelectOption } from '@penta/shared-ui';

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [SelectComponent],
  templateUrl: './select-page.html',
  styleUrl: './select-page.scss',
})
export class SelectPage {
  options: SelectOption[] = [
    { label: 'Alpha', value: 'alpha', description: 'Primary option' },
    { label: 'Beta', value: 'beta', description: 'Secondary option' },
    { label: 'Gamma', value: 'gamma', description: 'Additional option' },
    { label: 'Delta', value: 'delta' },
    {
      label: 'Legacy (disabled)',
      value: 'legacy',
      description: 'Always disabled',
      disabled: true,
    },
    { label: 'Restricted', value: 'restricted', description: 'Disabled when toggle is on' },
  ];

  basicValue: string | null = null;
  multiValue: string[] = ['alpha', 'gamma'];
  filterValue: string | null = null;
  leftLabelValue: string | null = 'beta';
  hiddenLabelValue: string | null = 'gamma';
  requiredValue: string | null = null;
  clearValue: string | null = 'beta';
  disabledValue: string | null = 'gamma';
  chipValue: string[] = ['alpha', 'beta', 'gamma'];

  disabledToggle = true;
  lockRestricted = true;
  chipsToggle = true;

  optionDisabled = (option: SelectOption): boolean => {
    return this.lockRestricted && option.value === 'restricted';
  };

  toggleDisabled(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.disabledToggle = Boolean(target?.checked);
  }

  toggleRestricted(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.lockRestricted = Boolean(target?.checked);
  }
}
