import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Table, InputComponent, Button } from '@penta/shared-ui';

@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [CommonModule, Table, InputComponent, Button],
  templateUrl: './table-page.html',
  styleUrl: './table-page.scss',
})
export class TablePage {
  indexDemo = true;
  indexCode = this.buildIndexCode(this.indexDemo);
  response = {
    Status: true,
    ResponseData: [
      {
        LotNo: '545806822104316032',
        PlanCode: 'Sub-Accessories',
        ParentLotNo: 'PQ0426000000001',
        Status: 'COMPLETED',
        UpdatedBy: 'P3117',
        CreatedOn: '2026-01-23T09:40:43.5580223',
        UpdatedOn: '2026-01-23T09:58:53.2641122',
      },
      {
        LotNo: '548823669594601600',
        PlanCode: 'Sub-Accessories',
        ParentLotNo: null,
        Status: 'PROCESSING',
        UpdatedBy: 'P3117',
        CreatedOn: '2026-01-27T13:34:39.8651063',
        UpdatedOn: '2026-01-27T13:34:40.1200041',
      },
      {
        LotNo: 'VDO22012026-001',
        PlanCode: 'Sub-Battery',
        ParentLotNo: null,
        Status: 'COMPLETED',
        UpdatedBy: 'O_001',
        CreatedOn: '2026-01-24T13:34:30.8651063',
        UpdatedOn: '2026-01-25T16:34:40.1200041',
      },
      {
        LotNo: 'VDO23012026-003',
        PlanCode: 'Sub-Battery',
        ParentLotNo: 'PQ0426000000001',
        Status: 'COMPLETED',
        UpdatedBy: 'E_001',
        CreatedOn: '2025-10-27T09:34:39.8651063',
        UpdatedOn: '2025-11-25T11:34:40.1200041',
      },
      {
        LotNo: 'TW0426000000009',
        PlanCode: 'Sub-Tower',
        ParentLotNo: null,
        Status: 'SCRAPPED',
        UpdatedBy: 'admin',
        CreatedOn: '2026-01-23T11:31:39.8651063',
        UpdatedOn: '2026-01-26T13:33:50.1200041',
      },
      {
        LotNo: 'TW0426000000010',
        PlanCode: 'Sub-Tower',
        ParentLotNo: null,
        Status: 'PROCESSING',
        UpdatedBy: 'P3117',
        CreatedOn: '2026-02-27T08:30:39.8651063',
        UpdatedOn: '2026-02-28T17:34:40.1200041',
      }
    ],
  };

  columns = [
    'LotNo',
    'PlanCode',
    'ParentLotNo',
    'Status',
    'UpdatedBy',
    'CreatedOn',
    'UpdatedOn',
  ];

  lastAction = 'No actions yet.';
  scanValue = '';
  scanHeaderEnabled = true;

  isCheckboxDisabled = (row: Record<string, unknown>) => {
    const status = String(row?.['Status'] ?? '').toUpperCase();
    return status === 'COMPLETED' || status === 'SCRAPPED';
  };

  onView(row: Record<string, unknown>) {
    this.lastAction = `View clicked for LotNo ${row?.['LotNo'] ?? ''}`;
  }

  onEdit(row: Record<string, unknown>) {
    this.lastAction = `Edit clicked for LotNo ${row?.['LotNo'] ?? ''}`;
  }

  onDelete(row: Record<string, unknown>) {
    this.lastAction = `Delete clicked for LotNo ${row?.['LotNo'] ?? ''}`;
  }

  onSelection(rows: unknown[]) {
    this.lastAction = `Selection changed: ${rows.length} row(s) selected.`;
  }

  onRowClick(row: Record<string, unknown>) {
    this.lastAction = `Row clicked for LotNo ${row?.['LotNo'] ?? ''}`;
  }

  onScan(value: string) {
    this.scanValue = value;
    this.lastAction = `Scan input: ${value}`;
  }

  toggleScanHeader(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.scanHeaderEnabled = Boolean(target?.checked);
  }

  toggleIndex(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.indexDemo = Boolean(target?.checked);
    this.indexCode = this.buildIndexCode(this.indexDemo);
  }

  private buildIndexCode(enabled: boolean): string {
    return `<pt-ui-table
  [data]="response.ResponseData"
  [displayIndex]="${enabled}"
></pt-ui-table>`;
  }
}
