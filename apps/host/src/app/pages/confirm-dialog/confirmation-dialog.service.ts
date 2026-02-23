import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogTone } from '@penta/shared-ui';

export interface ConfirmationDialogConfig {
  title: string;
  message: string;
  icon?: string;
  tone?: ConfirmDialogTone;
  confirmText?: string;
  cancelText?: string;
  closeOnBackdrop?: boolean;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
}

export interface ConfirmationDialogState {
  open: boolean;
  title: string;
  message: string;
  icon: string;
  tone: ConfirmDialogTone;
  confirmText: string;
  cancelText: string;
  closeOnBackdrop: boolean;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  private readonly stateSubject = new BehaviorSubject<ConfirmationDialogState | null>(null);
  private resolver?: (value: boolean) => void;

  readonly state$ = this.stateSubject.asObservable();

  openDialog(
    title: string,
    message: string,
    options: Partial<ConfirmationDialogConfig> = {}
  ): Promise<boolean> {
    if (this.resolver) {
      this.resolver(false);
    }

    const config: ConfirmationDialogState = {
      open: true,
      title,
      message,
      icon: options.icon ?? 'help',
      tone: options.tone ?? 'confirm',
      confirmText: options.confirmText ?? 'Yes',
      cancelText: options.cancelText ?? 'No',
      closeOnBackdrop: options.closeOnBackdrop ?? false,
      width: options.width,
      height: options.height,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
    };

    this.stateSubject.next(config);

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  confirm(): void {
    this.finish(true);
  }

  cancel(): void {
    this.finish(false);
  }

  private finish(result: boolean): void {
    if (this.resolver) {
      this.resolver(result);
      this.resolver = undefined;
    }
    this.stateSubject.next(null);
  }
}
