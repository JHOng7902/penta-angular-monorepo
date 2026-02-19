import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'pt-ui-radio',
  standalone: true,
  imports: [MatRadioModule],
  templateUrl: './radio.html',
  styleUrl: './radio.scss',
})
export class RadioComponent {
  private static nextId = 0;
  private readonly autoId = `pt-ui-radio-${RadioComponent.nextId++}`;

  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() name?: string;
  @Input() value: unknown = null;
  @Input() id?: string;
  @Input() tabIndex?: number;
  @Input() disableRipple = false;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledby?: string;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<MatRadioChange>();
  @Output() pressed = new EventEmitter<MouseEvent>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  get inputId(): string {
    return this.id ?? this.autoId;
  }

  get inputName(): string {
    return this.name ?? this.inputId;
  }

  onChange(event: MatRadioChange): void {
    if (this.disabled) {
      return;
    }
    this.checkedChange.emit(event.source.checked);
    this.changed.emit(event);
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
