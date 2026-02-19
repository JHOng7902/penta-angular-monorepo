import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Button,
  ToastMessage,
  ToastMessageService,
  ToastMessageItem,
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
  customPreviewToasts: ToastMessageItem[] = [];
  private customToastTimeouts = new Map<string, number>();

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

  showCustomToast(type: ToastMessageType = 'info'): void {
    const toast: ToastMessageItem = {
      type,
      message: 'Custom themed preview toast.',
      durationMs: 0,
      closable: true,
    };
    this.customPreviewToasts = [toast, ...this.customPreviewToasts].slice(0, 3);
  }

  clearCustomToasts(): void {
    this.customPreviewToasts = [];
    this.customToastTimeouts.forEach((handle) => clearTimeout(handle));
    this.customToastTimeouts.clear();
  }

  private removeCustomToast(id: string): void {
    const handle = this.customToastTimeouts.get(id);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.customToastTimeouts.delete(id);
    }
    this.customPreviewToasts = this.customPreviewToasts.filter((toast) => toast.id !== id);
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
