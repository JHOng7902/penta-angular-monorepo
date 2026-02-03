import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { ToastMessageItem, ToastMessageType } from './toast-message';

type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastMessageConfig {
  position: ToastPosition;
  defaultDurationMs: number;
  typeDurations: Record<ToastMessageType, number>;
  maxToasts: number;
}

export interface ToastShowOptions {
  durationMs?: number;
  closable?: boolean;
  id?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastMessageService {
  private toastsSubject = new BehaviorSubject<ToastMessageItem[]>([]);
  private configSubject = new BehaviorSubject<ToastMessageConfig>({
    position: 'top-right',
    defaultDurationMs: 4000,
    typeDurations: {
      success: 3000,
      info: 4000,
      warning: 5000,
      error: 6000,
    },
    maxToasts: 6,
  });

  readonly toasts$ = this.toastsSubject.asObservable();
  readonly config$ = this.configSubject.asObservable();

  configure(config: Partial<ToastMessageConfig>): void {
    const current = this.configSubject.value;
    this.configSubject.next({
      ...current,
      ...config,
      typeDurations: {
        ...current.typeDurations,
        ...config.typeDurations,
      },
    });
  }

  //show the toast message
  showToast(type: ToastMessageType, message: string, options?: ToastShowOptions): string {
    const config = this.configSubject.value;
    const durationMs =
      typeof options?.durationMs === 'number'
        ? options.durationMs
        : config.typeDurations[type] ?? config.defaultDurationMs;
    const id = options?.id ?? this.generateId();

    const toast: ToastMessageItem = {
      id,
      type,
      message,
      durationMs,
      closable: options?.closable ?? true,
    };

    const next = [toast, ...this.toastsSubject.value];
    this.toastsSubject.next(next.slice(0, config.maxToasts));
    return id;
  }

  // dismiss the toast message
  dismiss(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
