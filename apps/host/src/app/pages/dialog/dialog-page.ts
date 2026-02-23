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
  basicOpen = false;
  dragOpen = false;
  sizeOpen = false;
  customOpen = false;

  closeOnBackdrop = true;
  lastEvent = 'No close events yet.';

  dialogWidth = '640px';
  dialogHeight = 'auto';
  dialogMaxWidth = '900px';
  dialogMaxHeight = '70vh';

  onClosed(event: DialogCloseEvent): void {
    this.lastEvent = `Closed by ${event.reason}`;
  }

}
