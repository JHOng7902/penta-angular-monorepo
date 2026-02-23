import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogType } from '@penta/shared-ui';

export interface ConfirmationDialogConfig {
  title: string;
  message: string;
  icon?: string;
  type?: ConfirmDialogType;
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
  type: ConfirmDialogType;
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
      this.resolver = undefined;
    }

    const resolvedType = options.type ?? 'confirmation';

    const config: ConfirmationDialogState = {
      open: true,
      title,
      message,
      icon: options.icon ?? 'help',
      type: resolvedType,
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

    const current = this.stateSubject.value;
    if (!current) {
      return;
    }

    this.stateSubject.next({ ...current, open: false });
  }

  onAfterClosed(): void {
    const current = this.stateSubject.value;
    if (current && !current.open) {
      this.stateSubject.next(null);
    }
  }
}
