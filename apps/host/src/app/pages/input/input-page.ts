import { Component } from '@angular/core';
import { InputComponent } from '@penta/shared-ui';

@Component({
  selector: 'app-input-page',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './input-page.html',
  styleUrl: './input-page.scss',
})
export class InputPage {
  basicValue = '';
  passwordValue = '';
  emailValue = '';
  leftLabelValue = '';
  hiddenLabelValue = '';
  requiredValue = '';
  disabledValue = 'Locked value';
  minMaxValue = '';
  iconValue = '';
  iconShortValue = '';
  iconText = 'email';
  clearValue = '';
  disabledToggle = true;
  textareaValue = '';
  dateValue = '';
  dateTimeValue = '';
  timeValue = '';
  blinkValue = '';
  eventValue = '';
  lastKey = '';
  enterCount = 0;
  iconClickCount = 0;

  toggleDisabled(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.disabledToggle = Boolean(target?.checked);
  }

  onInputKeyup(event: KeyboardEvent): void {
    this.lastKey = event.key;
  }

  onInputEnter(event: KeyboardEvent): void {
    this.enterCount += 1;
    this.lastKey = event.key;
  }

  onInputIconClick(): void {
    this.iconClickCount += 1;
  }
}
