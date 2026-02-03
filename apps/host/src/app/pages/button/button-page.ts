import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button, InputComponent } from '@penta/shared-ui';

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [CommonModule, Button, InputComponent],
  templateUrl: './button-page.html',
  styleUrl: './button-page.scss',
})
export class ButtonPage {
  disableName = '';
}
