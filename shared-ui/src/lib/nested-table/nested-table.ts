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
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Table, TableColumn } from '../table/table';
import { PentaDateTimePipe } from '../table/table-date.pipe';

@Component({
  selector: 'pt-ui-nested-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    Table,
    PentaDateTimePipe,
  ],
  templateUrl: './nested-table.html',
  styleUrl: './nested-table.scss',
})
export class NestedTable implements OnChanges, AfterViewInit {
  @Input() data: Record<string, unknown>[] = [];
  @Input() columns: Array<TableColumn | string> = [];
  @Input() nestedColumns: Array<TableColumn | string> = [];
  @Input() nestedKey = 'children';
  @Input() nestedLabel?: string;
  @Input() displayView = false;
  @Input() displayEdit = false;
  @Input() displayDelete = false;
  @Input() displayNestedView = false;
  @Input() displayNestedEdit = false;
  @Input() displayNestedDelete = false;
  @Input() displayIndex = false;
  @Input() displayNestedIndex = false;
  @Input() displayCheckbox = false;
  @Input() displayNestedCheckbox = false;
  @Input() enableSorting = false;
  @Input() enableNestedSorting = false;
  @Input() tableHeight?: string;
  @Input() nestedTableHeight?: string;
  @Input() stickyHeader = false;
  @Input() nestedStickyHeader = false;
  @Input() expandIcon = 'chevron_right';
  @Input() collapseIcon = 'expand_more';

  @Output() view = new EventEmitter<Record<string, unknown>>();
  @Output() edit = new EventEmitter<Record<string, unknown>>();
  @Output() remove = new EventEmitter<Record<string, unknown>>();
  @Output() nestedView = new EventEmitter<Record<string, unknown>>();
  @Output() nestedEdit = new EventEmitter<Record<string, unknown>>();
  @Output() nestedRemove = new EventEmitter<Record<string, unknown>>();
  @Output() selectionChange = new EventEmitter<Record<string, unknown>[]>();
  @Output() nestedSelectionChange = new EventEmitter<Record<string, unknown>[]>();

  @ViewChild(MatSort) sort?: MatSort;

  dataSource = new MatTableDataSource<Record<string, unknown>>([]);
  normalizedColumns: TableColumn[] = [];
  displayedColumns: string[] = [];
  detailColumns = ['detail'];
  expandedRow: Record<string, unknown> | null = null;
  selection = new SelectionModel<Record<string, unknown>>(true, []);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns'] || changes['nestedKey']) {
      this.normalizedColumns = this.normalizeColumns();
      this.displayedColumns = this.buildDisplayedColumns();
      this.dataSource.data = this.data ?? [];
      this.selection.clear();
      this.emitSelection();
      if (this.expandedRow && !this.data.includes(this.expandedRow)) {
        this.expandedRow = null;
      }
    }
    if (changes['displayView'] || changes['displayEdit'] || changes['displayDelete']) {
      this.displayedColumns = this.buildDisplayedColumns();
    }
    if (changes['displayCheckbox']) {
      this.displayedColumns = this.buildDisplayedColumns();
      this.selection.clear();
      this.emitSelection();
    }
    if (changes['enableSorting']) {
      this.configureSorting();
    }
  }

  ngAfterViewInit(): void {
    this.configureSorting();
  }

  toggleRow(row: Record<string, unknown>, event?: MouseEvent): void {
    event?.stopPropagation();
    if (!this.rowHasChildren(row)) {
      return;
    }
    this.expandedRow = this.isExpanded(row) ? null : row;
  }

  toggleSelection(row: Record<string, unknown>, event: MatCheckboxChange): void {
    void event;
    this.selection.toggle(row);
    this.emitSelection();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle(event: MatCheckboxChange): void {
    void event;
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
    this.emitSelection();
  }

  isExpanded(row: Record<string, unknown>): boolean {
    return this.expandedRow === row;
  }

  rowHasChildren(row: Record<string, unknown>): boolean {
    const children = row?.[this.nestedKey];
    return Array.isArray(children) && children.length > 0;
  }

  nestedData(row: Record<string, unknown>): Record<string, unknown>[] {
    const children = row?.[this.nestedKey];
    return Array.isArray(children) ? children : [];
  }

  get detailLabel(): string {
    return this.nestedLabel ?? this.titleize(this.nestedKey);
  }

  get nestedStickyOffset(): string {
    return this.stickyHeader && this.nestedStickyHeader ? '56px' : '0px';
  }

  onView(row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    this.view.emit(row);
  }

  onEdit(row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(row);
  }

  onDelete(row: Record<string, unknown>, event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit(row);
  }

  onNestedView(row: Record<string, unknown>): void {
    this.nestedView.emit(row);
  }

  onNestedEdit(row: Record<string, unknown>): void {
    this.nestedEdit.emit(row);
  }

  onNestedDelete(row: Record<string, unknown>): void {
    this.nestedRemove.emit(row);
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
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

  isDateCell(key: string, value: unknown): boolean {
    if (!this.isDateValue(value)) {
      return false;
    }
    const tokens = this.keyTokens(key);
    return ['date', 'time', 'created', 'updated', 'on'].some((token) => tokens.includes(token));
  }

  trackByKey(_index: number, column: TableColumn): string {
    return column.key;
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

    return Object.keys(firstRow)
      .filter((key) => key !== this.nestedKey)
      .map((key) => ({
        key,
        label: this.titleize(key),
      }));
  }

  private titleize(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (char) => char.toUpperCase());
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

  private buildDisplayedColumns(): string[] {
    const cols = this.normalizedColumns.map((col) => col.key);
    const actionsEnabled = this.displayView || this.displayEdit || this.displayDelete;
    return [
      'expand',
      ...(this.displayCheckbox ? ['select'] : []),
      ...(actionsEnabled ? ['actions'] : []),
      ...(this.displayIndex ? ['index'] : []),
      ...cols,
    ];
  }

  private configureSorting(): void {
    if (!this.enableSorting || !this.sort) {
      this.dataSource.sort = undefined;
      return;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      const raw = item?.[property];
      if (this.isDateCell(property, raw)) {
        return Date.parse(String(raw));
      }
      if (typeof raw === 'number') {
        return raw;
      }
      if (typeof raw === 'string') {
        const numeric = Number(raw.replace(/,/g, ''));
        if (!Number.isNaN(numeric) && raw.trim() !== '') {
          return numeric;
        }
        return raw.toLowerCase();
      }
      if (raw === null || raw === undefined) {
        return '';
      }
      return String(raw).toLowerCase();
    };
  }

  private emitSelection(): void {
    this.selectionChange.emit(this.selection.selected);
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

  rowIndex(row: Record<string, unknown>): number {
    const data = this.dataSource.filteredData ?? this.dataSource.data;
    const index = data.indexOf(row);
    return index >= 0 ? index + 1 : 0;
  }
}
