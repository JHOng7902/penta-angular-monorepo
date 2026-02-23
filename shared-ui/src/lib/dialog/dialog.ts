import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type DialogCloseReason = 'backdrop' | 'close';

export interface DialogCloseEvent {
  reason: DialogCloseReason;
  event?: MouseEvent;
}

@Component({
  selector: 'pt-ui-dialog',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class DialogComponent {
  private static nextId = 0;
  private readonly titleId = `pt-ui-dialog-title-${DialogComponent.nextId++}`;

  @Input() open = false;
  @Input() title = '';
  @Input() ariaLabel?: string;
  @Input() draggable = false;
  @Input() closeOnBackdrop = true;
  @Input() showClose = true;
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() maxWidth?: string | number;
  @Input() maxHeight?: string | number;
  @Input() minWidth?: string | number;
  @Input() minHeight?: string | number;
  @Input() showFooter = false;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<DialogCloseEvent>();

  get ariaLabelledBy(): string | null {
    if (this.title) {
      return this.titleId;
    }
    if (!this.ariaLabel) {
      return this.titleId;
    }
    return null;
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

  onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (!this.closeOnBackdrop || !this.open) {
      return;
    }
    this.requestClose('backdrop', event);
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
    this.requestClose('backdrop');
  }

  onCloseClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.open) {
      return;
    }
    this.requestClose('close', event);
  }

  private requestClose(reason: DialogCloseReason, event?: MouseEvent): void {
    this.open = false;
    this.openChange.emit(false);
    this.closed.emit({ reason, event });
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
