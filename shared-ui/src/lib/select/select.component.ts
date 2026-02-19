import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

export interface SelectOption {
  value: unknown;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type SelectValue = unknown | unknown[] | null;

@Component({
  selector: 'pt-ui-select',
  standalone: true,
  imports: [MatSelectModule, MatIconModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  private static nextId = 0;
  private readonly autoId = `pt-ui-select-${SelectComponent.nextId++}`;

  private _multiple = false;
  private _value: SelectValue = null;

  @Input() label = '';
  @Input() placeholder = 'Select...';
  @Input() required = false;
  @Input() disabled = false;
  @Input() labelPosition: 'top' | 'left' | 'hidden' = 'top';
  @Input() showFilter = false;
  @Input() filterPlaceholder = 'Filter options...';
  @Input() showClear = false;
  @Input() displayAsChips = false;
  @Input() chipRemovable = true;
  @Input() options: SelectOption[] = [];
  @Input() id?: string;
  @Input() name?: string;
  @Input() panelClass?: string | string[];
  @Input() optionDisabled: boolean | ((option: SelectOption) => boolean) = false;
  @Input() compareWith: (a: unknown, b: unknown) => boolean = (a, b) => a === b;

  @Output() valueChange = new EventEmitter<SelectValue>();
  @Output() cleared = new EventEmitter<void>();

  @ViewChild('filterInput')
  filterInput?: ElementRef<HTMLInputElement>;

  filterValue = '';

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = Boolean(value);
    this._value = this.normalizeValue(this._value, this._multiple);
  }

  @Input()
  get value(): SelectValue {
    return this._value;
  }
  set value(value: SelectValue) {
    this._value = this.normalizeValue(value, this._multiple);
  }

  get inputId(): string {
    return this.id ?? this.autoId;
  }

  get showClearButton(): boolean {
    return this.showClear && !this.disabled && this.hasSelection();
  }

  get filteredOptions(): SelectOption[] {
    const options = this.options ?? [];
    if (!this.showFilter) {
      return options;
    }
    const query = this.filterValue.trim().toLowerCase();
    if (!query) {
      return options;
    }
    return options.filter((option) => this.matchesFilter(option, query));
  }

  get displayValue(): string {
    const labels = this.selectedOptionItems().map((item) => item.label);
    if (labels.length === 0) {
      return this.placeholder;
    }
    if (!this.multiple) {
      return labels[0];
    }
    if (labels.length <= 2) {
      return labels.join(', ');
    }
    return `${labels[0]}, ${labels[1]} +${labels.length - 2} more`;
  }

  get isPlaceholder(): boolean {
    return this.selectedOptionItems().length === 0;
  }

  get chipItems(): Array<{ label: string; value: unknown }> {
    return this.selectedOptionItems();
  }

  get showChips(): boolean {
    return this.displayAsChips && this.selectedOptionItems().length > 0;
  }

  get showFilterClear(): boolean {
    return !this.disabled && this.showFilter && this.filterValue.trim().length > 0;
  }

  get panelClasses(): string | string[] {
    const baseClass = 'pt-ui-select__panel';
    if (!this.panelClass || (Array.isArray(this.panelClass) && this.panelClass.length === 0)) {
      return baseClass;
    }
    const custom = Array.isArray(this.panelClass) ? this.panelClass : [this.panelClass];
    return [baseClass, ...custom];
  }

  onSelectionChange(event: MatSelectChange): void {
    this.value = event.value;
    this.valueChange.emit(this.value);
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clearSelection();
  }

  onFilterInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.filterValue = target?.value ?? '';
  }

  onFilterClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.filterValue = '';
    this.focusFilterInput();
  }

  onChipRemove(item: { label: string; value: unknown }, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.multiple) {
      const current = Array.isArray(this.value) ? this.value : [];
      const next = current.filter((value) => !this.compareWith(value, item.value));
      this.value = next;
    } else {
      this.value = null;
    }
    this.valueChange.emit(this.value);
  }

  onFilterKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Tab') {
      return;
    }
    event.stopPropagation();
  }

  focusFilterInput(): void {
    if (!this.showFilter || this.disabled) {
      return;
    }
    setTimeout(() => {
      this.filterInput?.nativeElement.focus();
    }, 0);
  }

  onOpenedChange(opened: boolean): void {
    if (!opened) {
      this.filterValue = '';
      return;
    }
    if (this.showFilter) {
      setTimeout(() => {
        this.filterInput?.nativeElement.focus();
      }, 0);
    }
  }

  isOptionDisabled(option: SelectOption): boolean {
    if (option.disabled) {
      return true;
    }
    if (typeof this.optionDisabled === 'function') {
      return this.optionDisabled(option);
    }
    return Boolean(this.optionDisabled);
  }

  trackByOption(index: number, option: SelectOption): unknown {
    return option.value ?? option.label ?? index;
  }

  trackByChip(index: number, item: { label: string; value: unknown }): unknown {
    return item.value ?? item.label ?? index;
  }

  private clearSelection(): void {
    this.value = this.multiple ? [] : null;
    this.valueChange.emit(this.value);
    this.cleared.emit();
  }

  private selectedOptionItems(): Array<{ label: string; value: unknown }> {
    const options = this.options ?? [];
    if (this.multiple) {
      const current = Array.isArray(this.value) ? this.value : [];
      return current
        .map((selected) => {
          const matched = options.find((option) =>
            this.compareWith(option.value, selected),
          );
          if (matched) {
            return { label: matched.label, value: matched.value };
          }
          if (selected === null || selected === undefined) {
            return null;
          }
          return { label: String(selected), value: selected };
        })
        .filter((item): item is { label: string; value: unknown } => item !== null);
    }

    const selectedValue = Array.isArray(this.value) ? this.value[0] : this.value;
    if (selectedValue === null || selectedValue === undefined) {
      return [];
    }
    const matched = options.find((option) =>
      this.compareWith(option.value, selectedValue),
    );
    if (matched) {
      return [{ label: matched.label, value: matched.value }];
    }
    return [{ label: String(selectedValue), value: selectedValue }];
  }

  private matchesFilter(option: SelectOption, query: string): boolean {
    const label = option.label?.toLowerCase() ?? '';
    const value = option.value === null || option.value === undefined ? '' : String(option.value);
    return label.includes(query) || value.toLowerCase().includes(query);
  }

  private hasSelection(): boolean {
    if (this.multiple) {
      return Array.isArray(this.value) && this.value.length > 0;
    }
    return this.value !== null && this.value !== undefined;
  }

  private normalizeValue(value: SelectValue, multiple: boolean): SelectValue {
    if (multiple) {
      if (Array.isArray(value)) {
        return value;
      }
      if (value === null || value === undefined) {
        return [];
      }
      return [value];
    }
    if (Array.isArray(value)) {
      return value[0] ?? null;
    }
    return value ?? null;
  }
}
