import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button, DialogComponent, InputComponent } from '@penta/shared-ui';
import { DialogCloseEvent } from '@penta/shared-ui';

@Component({
  selector: 'app-dialog-page',
  standalone: true,
  imports: [CommonModule, Button, DialogComponent, InputComponent],
  templateUrl: './dialog-page.html',
  styleUrl: './dialog-page.scss',
})
export class DialogPage {
  serviceState: { open: boolean; title: string; message: string } | null = null;
  basicOpen = false;
  dragOpen = false;
  sizeOpen = false;
  customOpen = false;

  closeOnBackdrop = true;
  lastEvent = 'No close events yet.';
  serviceResult = 'No service action yet.';

  dialogWidth = '640px';
  dialogHeight = 'auto';
  dialogMaxWidth = '900px';
  dialogMaxHeight = '70vh';

  onClosed(event: DialogCloseEvent): void {
    this.lastEvent = `Closed by ${event.reason}`;
  }

  onAfterClosed(): void {
    this.lastEvent = `${this.lastEvent} (animation done)`;
  }

  openServiceDialog(): void {
    this.serviceResult = 'Waiting for decision...';
    this.serviceState = {
      open: true,
      title: 'Service dialog',
      message: 'State cleanup will run after close animation completes.',
    };
  }

  confirmServiceDialog(): void {
    const current = this.serviceState;
    if (!current) {
      return;
    }
    this.serviceResult = 'Confirmed';
    this.serviceState = { ...current, open: false };
  }

  cancelServiceDialog(): void {
    const current = this.serviceState;
    if (!current) {
      return;
    }
    this.serviceResult = 'Cancelled';
    this.serviceState = { ...current, open: false };
  }

  onServiceClosed(event: DialogCloseEvent): void {
    const current = this.serviceState;
    if (!current) {
      return;
    }
    this.serviceResult = `Closed by ${event.reason}`;
    this.serviceState = { ...current, open: false };
  }

  onServiceAfterClosed(): void {
    const current = this.serviceState;
    if (current && !current.open) {
      this.serviceState = null;
    }
  }

}
