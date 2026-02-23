import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../button/button';

export type ConfirmDialogTone = 'confirm' | 'alert' | 'neutral';

@Component({
  selector: 'pt-ui-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialogComponent {
  private static nextId = 0;
  private readonly titleId = `pt-ui-confirm-dialog-title-${ConfirmDialogComponent.nextId++}`;

  @Input() open = false;
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure you want to continue?';
  @Input() ariaLabel?: string;
  @Input() icon = 'help';
  @Input() tone: ConfirmDialogTone = 'confirm';
  @Input() confirmText = 'Yes';
  @Input() cancelText = 'No';
  @Input() closeOnBackdrop = false;
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() maxWidth?: string | number;
  @Input() maxHeight?: string | number;
  @Input() minWidth?: string | number;
  @Input() minHeight?: string | number;
  @Input() panelClass?: string | string[];
  @Input() backdropClass?: string | string[];

  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get toneClass(): string {
    return `pt-ui-confirm-dialog--${this.tone}`;
  }

  get dialogAriaLabel(): string | null {
    return this.title ? null : this.ariaLabel ?? 'Confirmation dialog';
  }

  get dialogAriaLabelledBy(): string | null {
    return this.title ? this.titleId : null;
  }

  get dialogTitleId(): string {
    return this.titleId;
  }

  get panelStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    const width = this.resolveSize(this.width);
    const height = this.resolveSize(this.height);
    const maxWidth = this.resolveSize(this.maxWidth);
    const maxHeight = this.resolveSize(this.maxHeight);
    const minWidth = this.resolveSize(this.minWidth);
    const minHeight = this.resolveSize(this.minHeight);

    if (width) {
      styles['width'] = width;
    }
    if (height) {
      styles['height'] = height;
    }
    if (maxWidth) {
      styles['max-width'] = maxWidth;
    }
    if (maxHeight) {
      styles['max-height'] = maxHeight;
    }
    if (minWidth) {
      styles['min-width'] = minWidth;
    }
    if (minHeight) {
      styles['min-height'] = minHeight;
    }

    return styles;
  }

  get panelClasses(): string[] {
    const custom = this.panelClass
      ? Array.isArray(this.panelClass)
        ? this.panelClass
        : [this.panelClass]
      : [];
    return ['pt-ui-confirm-dialog__panel', this.toneClass, ...custom];
  }

  get backdropClasses(): string[] {
    const custom = this.backdropClass
      ? Array.isArray(this.backdropClass)
        ? this.backdropClass
        : [this.backdropClass]
      : [];
    return ['pt-ui-confirm-dialog__backdrop', ...custom];
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (!this.closeOnBackdrop || !this.open) {
      return;
    }
    this.onCancel();
  }

  onBackdropKey(event: Event): void {
    if (!this.closeOnBackdrop || !this.open) {
      return;
    }
    if (!(event instanceof KeyboardEvent)) {
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.onCancel();
  }

  onConfirm(): void {
    if (!this.open) {
      return;
    }
    this.open = false;
    this.openChange.emit(false);
    this.confirmed.emit();
  }

  onCancel(): void {
    if (!this.open) {
      return;
    }
    this.open = false;
    this.openChange.emit(false);
    this.cancelled.emit();
  }

  private resolveSize(value?: string | number): string | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') {
      return `${value}px`;
    }
    return value;
  }
}
