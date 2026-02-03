import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pentaDateTime',
  standalone: true,
})
export class PentaDateTimePipe implements PipeTransform {
  transform(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const isPm = hours >= 12;
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const hourStr = String(hours).padStart(2, '0');
    const suffix = isPm ? 'pm' : 'am';

    return `${day} ${month} ${year}, ${hourStr}:${minutes}:${seconds}${suffix}`;
  }
}