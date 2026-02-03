import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'pt-ui-input',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  private static nextId = 0;
  private readonly autoId = `pt-ui-input-${InputComponent.nextId++}`;
  private readonly blockedTypes = new Set(['radio', 'checkbox', 'button']);

  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiline = false;
  @Input() labelPosition: 'top' | 'left' | 'hidden' = 'top';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() icon?: string;
  @Input() iconMode: 'auto' | 'text' = 'auto';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() iconClickable = false;
  @Input() showClear = false;
  @Input() allowPasswordPreview = false;
  @Input() blink = false;
  @Input() id?: string;
  @Input() name?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() keyupEvent = new EventEmitter<KeyboardEvent>();
  @Output() keydownEnterEvent = new EventEmitter<KeyboardEvent>();
  @Output() iconClick = new EventEmitter<void>();

  get inputType(): string {
    const normalized = (this.type || 'text').toLowerCase();
    return this.blockedTypes.has(normalized) ? 'text' : normalized;
  }

  get actualInputType(): string {
    if (this.inputType === 'password') {
      return this.allowPasswordPreview && this.isPasswordVisible ? 'text' : 'password';
    }
    return this.inputType;
  }

  get inputId(): string {
    return this.id ?? this.autoId;
  }

  get displayValue(): string {
    return this.toInputValue(this.value ?? '');
  }

  get showClearButton(): boolean {
    return this.showClear && !this.disabled && !!this.value;
  }

  get showPasswordToggle(): boolean {
    return this.allowPasswordPreview && this.inputType === 'password' && !this.multiline;
  }

  get showActionDivider(): boolean {
    return this.showClearButton && this.showPasswordToggle;
  }

  get hasLeadingIcon(): boolean {
    return !!this.icon && !this.isIconTrailing;
  }

  get hasTrailingIcon(): boolean {
    return !!this.icon && this.isIconTrailing;
  }

  get isTextIcon(): boolean {
    if (!this.icon) {
      return false;
    }
    if (this.iconMode === 'text') {
      return true;
    }
    return !this.isMaterialIcon;
  }

  get isIconTrailing(): boolean {
    return this.iconPosition === 'right';
  }

  get isMaterialIcon(): boolean {
    if (!this.icon) {
      return false;
    }
    if (this.iconMode === 'text') {
      return false;
    }
    return /^[a-z0-9_]+$/.test(this.icon);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const rawValue = target?.value ?? '';
    const nextValue = this.normalizeValue(rawValue);
    this.value = nextValue;
    this.valueChange.emit(nextValue);
  }

  onClear(): void {
    this.value = '';
    this.valueChange.emit('');
  }

  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  @HostListener('keyup', ['$event'])
  onHostKeyup(event: KeyboardEvent): void {
    if (!this.isInputTarget(event.target)) {
      return;
    }
    this.keyupEvent.emit(event);
  }

  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (!this.isInputTarget(event.target)) {
      return;
    }
    if (event.key === 'Enter') {
      this.keydownEnterEvent.emit(event);
    }
  }

  onIconClick(): void {
    if (this.disabled || !this.iconClickable || !this.icon) {
      return;
    }
    this.iconClick.emit();
  }

  private isInputTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    const tagName = target.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea';
  }

  private normalizeValue(value: string): string {
    if (!value) {
      return '';
    }
    if (this.inputType === 'date') {
      return value.includes('T') ? value.split('T')[0] : value;
    }
    if (this.inputType === 'datetime-local') {
      const normalized = value.length === 16 ? `${value}:00` : value;
      return normalized.endsWith('Z') ? normalized : `${normalized}Z`;
    }
    if (this.inputType === 'time') {
      const normalized = value.length === 5 ? `${value}:00` : value;
      return normalized.endsWith('Z') ? normalized : `${normalized}Z`;
    }
    return value;
  }

  private toInputValue(value: string): string {
    if (!value) {
      return '';
    }
    if (this.inputType === 'date') {
      return value.split('T')[0] ?? value;
    }
    if (this.inputType === 'datetime-local') {
      const dateTime = value.replace(/Z$/, '').split(/[+-]\d{2}:?\d{2}$/)[0];
      return dateTime.length >= 16 ? dateTime.slice(0, 16) : dateTime;
    }
    if (this.inputType === 'time') {
      const timePart = value.includes('T') ? value.split('T')[1] ?? value : value;
      const clean = timePart.replace(/Z$/, '').split(/[+-]\d{2}:?\d{2}$/)[0];
      return clean.length >= 5 ? clean.slice(0, 8) : clean;
    }
    return value;
  }
}

