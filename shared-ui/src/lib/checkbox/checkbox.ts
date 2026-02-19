import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'pt-ui-checkbox',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxComponent {
  private static nextId = 0;
  private readonly autoId = `pt-ui-checkbox-${CheckboxComponent.nextId++}`;

  @Input() label = '';
  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() name?: string;
  @Input() value?: string;
  @Input() id?: string;
  @Input() tabIndex?: number;
  @Input() disableRipple = false;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledby?: string;

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<MatCheckboxChange>();
  @Output() indeterminateChanged = new EventEmitter<boolean>();
  @Output() pressed = new EventEmitter<MouseEvent>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  get inputId(): string {
    return this.id ?? this.autoId;
  }

  onChange(event: MatCheckboxChange): void {
    if (this.disabled) {
      event.source.checked = this.checked;
      return;
    }
    this.checked = event.checked;
    this.indeterminate = event.source.indeterminate;
    this.checkedChange.emit(this.checked);
    this.changed.emit(event);
  }

  onIndeterminateChange(value: boolean): void {
    this.indeterminate = value;
    this.indeterminateChanged.emit(value);
  }

  onPressed(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.pressed.emit(event);
  }

  onFocus(event: FocusEvent): void {
    if (this.disabled) {
      return;
    }
    this.focused.emit(event);
  }

  onBlur(event: FocusEvent): void {
    if (this.disabled) {
      return;
    }
    this.blurred.emit(event);
  }
}
