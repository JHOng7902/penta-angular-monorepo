import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PentaDateTimePipe } from './table-date.pipe';

export interface TableColumn {
  key: string;
  label?: string;
}

@Component({
  selector: 'pt-ui-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    PentaDateTimePipe,
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table implements OnChanges, AfterViewInit {
  @Input() data: Record<string, unknown>[] = [];
  @Input() columns: Array<TableColumn | string> = [];
  @Input() displayCheckbox = false;
  @Input() displayView = false;
  @Input() displayEdit = false;
  @Input() displayDelete = false;
  @Input() displayIndex = false;
  @Input() enableSorting = false;
  @Input() displayPaginator = false;
  @Input() tableHeight?: string;
  @Input() stickyHeader = false;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() pageSize = 10;

  @Output() view = new EventEmitter<Record<string, unknown>>();
  @Output() edit = new EventEmitter<Record<string, unknown>>();
  @Output() remove = new EventEmitter<Record<string, unknown>>();
  @Output() selectionChange = new EventEmitter<Record<string, unknown>[]>();
  @Output() rowPressed = new EventEmitter<Record<string, unknown>>();

  private paginatorRef?: MatPaginator;
  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator | undefined) {
    this.paginatorRef = paginator;
    this.configurePaginator();
  }
  private sortRef?: MatSort;
  @ViewChild(MatSort)
  set sort(sort: MatSort | undefined) {
    this.sortRef = sort;
    this.configureSorting();
  }

  dataSource = new MatTableDataSource<Record<string, unknown>>([]);
  selection = new SelectionModel<Record<string, unknown>>(true, []);
  normalizedColumns: TableColumn[] = [];
  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] ||
      changes['columns'] ||
      changes['displayCheckbox'] ||
      changes['displayView'] ||
      changes['displayEdit'] ||
      changes['displayDelete'] ||
      changes['displayIndex']
    ) {
      this.normalizedColumns = this.normalizeColumns();
      this.displayedColumns = this.buildDisplayedColumns();
      this.dataSource.data = this.data ?? [];
      this.selection.clear();
      this.emitSelection();
    }
    if (changes['displayPaginator']) {
      this.configurePaginator();
    }
    if (changes['enableSorting']) {
      this.configureSorting();
    }
  }

  ngAfterViewInit(): void {
    this.configurePaginator();
    this.configureSorting();
  }

  onRowPressed(row: Record<string, unknown>): void {
    this.rowPressed.emit(row);
  }

  onView(row: Record<string, unknown>): void {
    this.view.emit(row);
  }

  onEdit(row: Record<string, unknown>): void {
    this.edit.emit(row);
  }

  onDelete(row: Record<string, unknown>): void {
    this.remove.emit(row);
  }

  rowIndex(index: number): number {
    if (this.displayPaginator && this.paginator) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }

  toggleRow(row: Record<string, unknown>): void {
    this.selection.toggle(row);
    this.emitSelection();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
    this.emitSelection();
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
  }

  isDateCell(key: string, value: unknown): boolean {
    if (!this.isDateValue(value)) {
      return false;
    }
    const tokens = this.keyTokens(key);
    return ['date', 'time', 'created', 'updated', 'on'].some((token) => tokens.includes(token));
  }

  isStatusColumn(key: string): boolean {
    const keyLower = key.toLowerCase();
    return keyLower === 'status' || keyLower === 'statusdescription';
  }

  statusLabel(row: Record<string, unknown>, key: string): string {
    if (key.toLowerCase() === 'status' && row['StatusDescription']) {
      return String(row['StatusDescription']);
    }
    return this.formatValue(row[key]);
  }

  statusClass(value: string): string {
    const normalized = value.toLowerCase();
    const tokens = this.statusTokens(value);
    if (this.hasStatus(tokens, normalized, ['open', 'new'])) {
      return 'status-open';
    }
    if (this.hasStatus(tokens, normalized, ['start', 'started'])) {
      return 'status-start';
    }
    if (this.hasStatus(tokens, normalized, ['processing', 'progress', 'in progress'])) {
      return 'status-processing';
    }
    if (
      this.hasStatus(tokens, normalized, [
        'completed',
        'complete',
        'done',
        'end',
        'ended',
        'closed',
        'finished',
      ])
    ) {
      return 'status-completed';
    }
    if (this.hasStatus(tokens, normalized, ['pending', 'queued', 'waiting'])) {
      return 'status-pending';
    }
    if (this.hasStatus(tokens, normalized, ['hold', 'paused', 'on hold'])) {
      return 'status-hold';
    }
    if (
      this.hasStatus(tokens, normalized, [
        'scrap',
        'scrapped',
        'canceled',
        'cancelled',
        'rejected',
        'failed',
      ])
    ) {
      return 'status-scrapped';
    }
    return 'status-default';
  }

  statusIcon(value: string): string {
    const normalized = value.toLowerCase();
    const tokens = this.statusTokens(value);
    if (this.hasStatus(tokens, normalized, ['open', 'new'])) {
      return 'inbox';
    }
    if (this.hasStatus(tokens, normalized, ['start', 'started'])) {
      return 'play_circle';
    }
    if (this.hasStatus(tokens, normalized, ['processing', 'progress', 'in progress'])) {
      return 'autorenew';
    }
    if (
      this.hasStatus(tokens, normalized, [
        'completed',
        'complete',
        'done',
        'end',
        'ended',
        'closed',
        'finished',
      ])
    ) {
      return 'check_circle';
    }
    if (this.hasStatus(tokens, normalized, ['pending', 'queued', 'waiting'])) {
      return 'hourglass_top';
    }
    if (this.hasStatus(tokens, normalized, ['hold', 'paused', 'on hold'])) {
      return 'pause_circle';
    }
    if (
      this.hasStatus(tokens, normalized, [
        'scrap',
        'scrapped',
        'canceled',
        'cancelled',
        'rejected',
        'failed',
      ])
    ) {
      return 'cancel';
    }
    return 'info';
  }

  trackByKey(_index: number, column: TableColumn): string {
    return column.key;
  }

  private emitSelection(): void {
    this.selectionChange.emit(this.selection.selected);
  }

  private normalizeColumns(): TableColumn[] {
    if (this.columns && this.columns.length > 0) {
      return this.columns.map((col) =>
        typeof col === 'string'
          ? { key: col, label: this.titleize(col) }
          : { key: col.key, label: col.label ?? this.titleize(col.key) },
      );
    }

    const firstRow = this.data?.[0];
    if (!firstRow) {
      return [];
    }

    return Object.keys(firstRow).map((key) => ({
      key,
      label: this.titleize(key),
    }));
  }

  //this is used for displaying row data
  private buildDisplayedColumns(): string[] {
    const cols = this.normalizedColumns.map((col) => col.key);
    const actionsEnabled = this.displayView || this.displayEdit || this.displayDelete;

    return [
      ...(this.displayCheckbox ? ['select'] : []),
      ...(actionsEnabled ? ['actions'] : []),
      ...(this.displayIndex ? ['index'] : []),
      ...cols,
    ];
  }

  private configureSorting(): void {
    if (!this.enableSorting || !this.sortRef) {
      this.dataSource.sort = undefined;
      return;
    }
    this.dataSource.sort = this.sortRef;
    this.dataSource.sortingDataAccessor = (item, property) => {
      const raw = item?.[property];
      const value = this.isStatusColumn(property) ? this.statusLabel(item, property) : raw;
      if (this.isDateCell(property, value)) {
        return Date.parse(String(value));
      }
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string') {
        const numeric = Number(value.replace(/,/g, ''));
        if (!Number.isNaN(numeric) && value.trim() !== '') {
          return numeric;
        }
        return value.toLowerCase();
      }
      if (value === null || value === undefined) {
        return '';
      }
      return String(value).toLowerCase();
    };
  }

  private configurePaginator(): void {
    if (this.displayPaginator && this.paginatorRef) {
      this.dataSource.paginator = this.paginatorRef;
    } else {
      this.dataSource.paginator = undefined;
    }
  }

  //this is used for displaying column headers
  private titleize(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private keyTokens(value: string): string[] {
    return value
      .replace(/_/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }

  private isDateValue(value: unknown): boolean {
    if (value instanceof Date) {
      return !Number.isNaN(value.getTime());
    }
    if (typeof value !== 'string') {
      return false;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }
    const looksLikeIso =
      /\d{4}-\d{2}-\d{2}/.test(trimmed) || /\d{2}:\d{2}/.test(trimmed);
    if (!looksLikeIso) {
      return false;
    }
    const parsed = Date.parse(trimmed);
    return !Number.isNaN(parsed);
  }

  private statusTokens(value: string): string[] {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }

  private hasStatus(tokens: string[], normalized: string, values: string[]): boolean {
    return values.some((value) =>
      value.includes(' ') ? normalized.includes(value) : tokens.includes(value),
    );
  }
}

