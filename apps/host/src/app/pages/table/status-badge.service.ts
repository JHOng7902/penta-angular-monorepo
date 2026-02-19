import { Injectable } from '@angular/core';
import { StatusOverride } from '@penta/shared-ui';

@Injectable({ providedIn: 'root' })
export class StatusBadgeService {
  resolve(status: string): StatusOverride | undefined {
    const normalized = String(status ?? '').toLowerCase();
    switch (normalized) {
      case 'completed':
      case 'complete':
      case 'done':
        return { class: 'status-custom-success', icon: 'verified' };
      case 'processing':
      case 'in progress':
      case 'progress':
      case 'started':
        return { class: 'status-custom-progress', icon: 'autorenew' };
      case 'new':
        return { class: 'status-custom-info', icon: 'bolt' };
      case 'scrapped':
      case 'scrap':
      case 'failed':
        return { class: 'status-custom-danger', icon: 'report' };
      default:
        return undefined;
    }
  }
}
