import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

export interface RadioGroupOption {
  label: string;
  value: unknown;
  description?: string;
  disabled?: boolean;
}

@Component({
  selector: 'pt-ui-radio-group',
  standalone: true,
  imports: [CommonModule, MatRadioModule],
  templateUrl: './radio-group.html',
  styleUrl: './radio-group.scss',
})
export class RadioGroupComponent {
  private static nextId = 0;
  private readonly autoId = `pt-ui-radio-group-${RadioGroupComponent.nextId++}`;

  @Input() label = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() direction: 'vertical' | 'horizontal' = 'vertical';
  @Input() options: RadioGroupOption[] = [];
  @Input() value: unknown = null;
  @Input() name?: string;
  @Input() id?: string;
  @Input() optionDisabled: boolean | ((option: RadioGroupOption) => boolean) = false;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  @Output() valueChange = new EventEmitter<unknown>();
  @Output() changed = new EventEmitter<MatRadioChange>();

  get groupId(): string {
    return this.id ?? this.autoId;
  }

  get groupName(): string {
    return this.name ?? this.groupId;
  }

  get isHorizontal(): boolean {
    return this.direction === 'horizontal';
  }

  onChange(event: MatRadioChange): void {
    if (this.disabled) {
      return;
    }
    this.valueChange.emit(event.value);
    this.changed.emit(event);
  }

  isOptionDisabled(option: RadioGroupOption): boolean {
    if (option.disabled) {
      return true;
    }
    if (typeof this.optionDisabled === 'function') {
      return this.optionDisabled(option);
    }
    return Boolean(this.optionDisabled);
  }

  trackByOption(index: number, option: RadioGroupOption): unknown {
    return option.value ?? option.label ?? index;
  }
}
