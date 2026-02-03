import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'pt-ui-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';
  @Input() content: 'text' | 'icon' | 'text-icon' = 'text';
  @Input() icon?: string;
  @Input() buttonText?: string;
  @Input() label?: string;
  @Input() disabled = false;
  @Input() blink = false;
  @Input() tooltip?: string;
  @Input() tooltipPosition: TooltipPosition = 'above';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel?: string;
  @Output() pressed = new EventEmitter<MouseEvent>();
  @Input() color:
    | 'primary'
    | 'accent'
    | 'warn'
    | 'success'
    | 'info'
    | 'neutral'
    | 'danger'
    | 'fail' = 'primary';

  get matColor(): 'primary' | 'accent' | 'warn' | undefined {
    if (this.color === 'primary' || this.color === 'accent' || this.color === 'warn') {
      return this.color;
    }
    return undefined;
  }

  get showIcon(): boolean {
    return (this.content === 'icon' || this.content === 'text-icon') && !!this.icon;
  }

  get showText(): boolean {
    return this.content === 'text' || this.content === 'text-icon';
  }

  get displayText(): string | undefined {
    return this.buttonText ?? this.label;
  }

  onPressed(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.pressed.emit(event);
  }
}

