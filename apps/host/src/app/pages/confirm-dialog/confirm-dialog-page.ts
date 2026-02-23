import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Button, ConfirmDialogComponent, InputComponent } from '@penta/shared-ui';
import { ConfirmDialogTone } from '@penta/shared-ui';
import { ConfirmationDialogService, ConfirmationDialogState } from './confirmation-dialog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog-page',
  standalone: true,
  imports: [CommonModule, Button, ConfirmDialogComponent, InputComponent],
  templateUrl: './confirm-dialog-page.html',
  styleUrl: './confirm-dialog-page.scss',
})
export class ConfirmDialogPage {
  confirmOpen = false;
  customOpen = false;
  sizeOpen = false;
  tone: ConfirmDialogTone = 'alert';
  confirmResult = 'No decision yet.';

  dialogWidth = '520px';
  dialogHeight = 'auto';
  dialogMinWidth = '320px';
  dialogMinHeight = 'auto';
  dialogMaxWidth = '720px';
  dialogMaxHeight = '70vh';

  readonly serviceState$: Observable<ConfirmationDialogState | null>;

  readonly confirmationDialogService = inject(ConfirmationDialogService);

  constructor() {
    this.serviceState$ = this.confirmationDialogService.state$;
  }

  openTone(tone: ConfirmDialogTone): void {
    this.tone = tone;
    this.confirmOpen = true;
  }

  onConfirmed(): void {
    this.confirmResult = 'Confirmed';
  }

  onCancelled(): void {
    this.confirmResult = 'Cancelled';
  }

  openServiceDialog(): void {
    this.confirmationDialogService
      .openDialog('Confirmation', 'Are you sure want to process, this cannot be undo', {
        icon: 'warning',
        tone: 'alert',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .then((confirmed) => {
        this.confirmResult = confirmed ? 'Confirmed' : 'Cancelled';
      });
  }
}
