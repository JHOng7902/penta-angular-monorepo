import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  inject,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ToastMessageService } from './toast-message.service';

export type ToastMessageType =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'loading'
  | 'neutral'
  | 'system';

export interface ToastMessageItem {
  id?: string;
  type?: ToastMessageType;
  title?: string;
  message: string;
  durationMs?: number;
  closable?: boolean;
}

export interface ToastDismissEvent {
  id: string;
  reason: 'manual' | 'timeout';
  toast: ToastMessageItem;
}

interface ToastMessageInternal extends ToastMessageItem {
  id: string;
  type: ToastMessageType;
  durationMs: number;
  closable: boolean;
  state: 'enter' | 'leaving';
}

type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

@Component({
  selector: 'pt-ui-toast-message',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './toast-message.html',
  styleUrl: './toast-message.scss',
})
export class ToastMessage implements OnChanges, OnDestroy, AfterViewInit {
  @Input() toasts: ToastMessageItem[] = [];
  @Input() defaultDurationMs = 4000;
  @Input() position: ToastPosition = 'top-right';
  @Input() useService = false;

  @Output() dismissed = new EventEmitter<ToastDismissEvent>();

  activeToasts: ToastMessageInternal[] = [];

  @ViewChildren('toastItem', { read: ElementRef })
  toastItems?: QueryList<ElementRef<HTMLElement>>;

  private toastMap = new Map<string, ToastMessageInternal>();
  private toastIdMap = new WeakMap<ToastMessageItem, string>();
  private timeoutHandles = new Map<string, number>();
  private dismissedIds = new Set<string>();
  private idCounter = 0;
  private readonly dismissAnimationMs = 220;
  private readonly reflowAnimationMs = 180;
  private previousPositions = new Map<string, DOMRect>();
  private toastItemsChangesSub?: Subscription;
  private serviceToastsSub?: Subscription;
  private serviceConfigSub?: Subscription;

  private toastService = inject(ToastMessageService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['useService']) {
      if (this.useService) {
        this.attachService();
      } else {
        this.detachService();
      }
    }
    if (changes['toasts']) {
      if (this.useService) {
        return;
      }
      this.syncToasts();
    }
  }

  ngAfterViewInit(): void {
    this.toastItemsChangesSub = this.toastItems?.changes.subscribe(() => {
      this.animateReflow();
    });
  }

  ngOnDestroy(): void {
    this.toastItemsChangesSub?.unsubscribe();
    this.detachService();
    this.timeoutHandles.forEach((handle) => clearTimeout(handle));
    this.timeoutHandles.clear();
  }

  get positionClass(): string {
    return `pt-ui-toast--${this.position}`;
  }

  iconFor(type: ToastMessageType): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'loading':
        return 'autorenew';
      case 'neutral':
        return 'info_outline';
      case 'system':
        return 'cloud';
      case 'info':
      default:
        return 'info';
    }
  }

  displayTitle(toast: ToastMessageInternal): string {
    return this.formatTypeLabel(toast.type);
  }

  onClose(toast: ToastMessageInternal, event?: MouseEvent): void {
    event?.stopPropagation();
    this.beginDismiss(toast, 'manual', true);
  }

  trackByToastId(_index: number, toast: ToastMessageInternal): string {
    return toast.id;
  }

  private syncToasts(): void {
    this.prepareForLayoutChange();
    const incomingIds = new Set<string>();
    const items = this.toasts ?? [];

    for (const item of items) {
      const id = this.resolveId(item);
      if (this.dismissedIds.has(id)) {
        continue;
      }
      incomingIds.add(id);
      const existing = this.toastMap.get(id);
      if (existing) {
        existing.type = item.type ?? existing.type;
        existing.title = item.title;
        existing.message = item.message;
        existing.closable = item.closable ?? true;
        const durationMs = this.normalizeDuration(item.durationMs);
        if (durationMs !== existing.durationMs) {
          existing.durationMs = durationMs;
          this.restartTimer(existing);
        }
        continue;
      }

      const internal: ToastMessageInternal = {
        id,
        type: item.type ?? 'info',
        title: item.title,
        message: item.message,
        durationMs: this.normalizeDuration(item.durationMs),
        closable: item.closable ?? true,
        state: 'enter',
      };
      this.toastMap.set(id, internal);
      this.activeToasts.push(internal);
      this.startTimer(internal);
    }

    for (const toast of [...this.activeToasts]) {
      if (!incomingIds.has(toast.id) && toast.state !== 'leaving') {
        this.beginDismiss(toast, 'manual', false);
      }
    }
  }

  private resolveId(item: ToastMessageItem): string {
    if (item.id) {
      return item.id;
    }
    const existing = this.toastIdMap.get(item);
    if (existing) {
      return existing;
    }
    const nextId = `toast-${++this.idCounter}`;
    this.toastIdMap.set(item, nextId);
    return nextId;
  }

  private normalizeDuration(duration?: number): number {
    if (duration === undefined || duration === null) {
      return this.defaultDurationMs;
    }
    return Math.max(0, duration);
  }

  private formatTypeLabel(type: ToastMessageType): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'loading':
        return 'Loading';
      case 'neutral':
        return 'Notice';
      case 'system':
        return 'System';
      case 'info':
      default:
        return 'Info';
    }
  }

  private startTimer(toast: ToastMessageInternal): void {
    if (toast.durationMs <= 0) {
      return;
    }
    this.clearTimer(toast.id);
    const handle = window.setTimeout(() => {
      this.beginDismiss(toast, 'timeout', true);
    }, toast.durationMs);
    this.timeoutHandles.set(toast.id, handle);
  }

  private restartTimer(toast: ToastMessageInternal): void {
    this.clearTimer(toast.id);
    this.startTimer(toast);
  }

  private clearTimer(id: string): void {
    const handle = this.timeoutHandles.get(id);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.timeoutHandles.delete(id);
    }
  }

  private beginDismiss(
    toast: ToastMessageInternal,
    reason: 'manual' | 'timeout',
    emitEvent: boolean,
  ): void {
    if (toast.state === 'leaving') {
      return;
    }
    toast.state = 'leaving';
    this.dismissedIds.add(toast.id);
    this.clearTimer(toast.id);
    if (this.useService) {
      this.toastService.dismiss(toast.id);
    }
    if (emitEvent) {
      this.dismissed.emit({ id: toast.id, reason, toast });
    }
    window.setTimeout(() => {
      this.prepareForLayoutChange();
      this.toastMap.delete(toast.id);
      this.activeToasts = this.activeToasts.filter((item) => item.id !== toast.id);
    }, this.dismissAnimationMs);
  }

  private prepareForLayoutChange(): void {
    const items = this.toastItems?.toArray() ?? [];
    this.previousPositions.clear();
    for (const item of items) {
      const el = item.nativeElement;
      const id = el.dataset['toastId'];
      if (!id) {
        continue;
      }
      this.previousPositions.set(id, el.getBoundingClientRect());
    }
  }

  private animateReflow(): void {
    if (this.previousPositions.size === 0) {
      return;
    }
    const items = this.toastItems?.toArray() ?? [];
    for (const item of items) {
      const el = item.nativeElement;
      const id = el.dataset['toastId'];
      if (!id) {
        continue;
      }
      const previous = this.previousPositions.get(id);
      if (!previous) {
        continue;
      }
      const next = el.getBoundingClientRect();
      const deltaY = previous.top - next.top;
      if (Math.abs(deltaY) < 1) {
        continue;
      }
      el.style.transition = 'none';
      el.style.transform = `translateY(${deltaY}px)`;
      el.getBoundingClientRect();
      el.style.transition = `transform ${this.reflowAnimationMs}ms ease`;
      el.style.transform = '';
      window.setTimeout(() => {
        el.style.transition = '';
      }, this.reflowAnimationMs);
    }
    this.previousPositions.clear();
  }

  private attachService(): void {
    this.detachService();
    this.serviceToastsSub = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
      this.syncToasts();
    });
    this.serviceConfigSub = this.toastService.config$.subscribe((config) => {
      this.position = config.position;
      this.defaultDurationMs = config.defaultDurationMs;
    });
  }

  private detachService(): void {
    this.serviceToastsSub?.unsubscribe();
    this.serviceConfigSub?.unsubscribe();
    this.serviceToastsSub = undefined;
    this.serviceConfigSub = undefined;
  }
}
