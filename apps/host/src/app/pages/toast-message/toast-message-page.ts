import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Button,
  ToastMessage,
  ToastMessageService,
  ToastMessageType,
} from '@penta/shared-ui';

type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

@Component({
  selector: 'app-toast-message-page',
  standalone: true,
  imports: [FormsModule, ToastMessage, Button],
  templateUrl: './toast-message-page.html',
  styleUrl: './toast-message-page.scss',
})
export class ToastMessagePage {
  position: ToastPosition = 'top-right';

  type: ToastMessageType = 'success';
  message = 'Your changes have been saved.';
  lastEvent = 'No toast dismissed yet.';

  readonly positions: ToastPosition[] = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ];

  readonly types: ToastMessageType[] = [
    'success',
    'error',
    'info',
    'warning',
    'loading',
    'neutral',
    'system',
  ];

  typeDurations: Record<ToastMessageType, number> = {
    success: 3000,
    info: 4000,
    warning: 5000,
    error: 6000,
    loading: 0,
    neutral: 4000,
    system: 4500,
  };
  maxToasts = 6;

  private toastService = inject(ToastMessageService);

  constructor() {
    this.applyConfig();
  }

  showToast(typeOverride?: ToastMessageType): void {
    const type = typeOverride ?? this.type;
    this.toastService.showToast(type, this.message);
  }

  showTypeToast(type: ToastMessageType): void {
    this.showToast(type);
  }

  clearToasts(): void {
    this.toastService.clear();
    this.lastEvent = 'All toasts cleared.';
  }

  onToastDismiss(message: string): void {
    this.lastEvent = message;
  }

  applyConfig(): void {
    this.toastService.configure({
      position: this.position,
      typeDurations: this.typeDurations,
      maxToasts: this.maxToasts,
    });
  }
}
