import { Component } from '@angular/core';
import { NestedTable } from '@penta/shared-ui';

@Component({
  selector: 'app-nested-table-page',
  standalone: true,
  imports: [NestedTable],
  templateUrl: './nested-table-page.html',
  styleUrl: './nested-table-page.scss',
})
export class NestedTablePage {
  displayView = true;
  displayEdit = true;
  displayDelete = true;
  displayNestedView = true;
  displayNestedEdit = true;
  displayNestedDelete = true;
  displayIndex = false;
  displayNestedIndex = true;
  displayCheckbox = false;
  displayNestedCheckbox = true;
  enableSorting = true;
  enableNestedSorting = true;
  tableHeight = '52vh';
  nestedTableHeight = '32vh';
  stickyHeader = true;
  nestedStickyHeader = true;
  lastAction = 'No actions yet.';

  response = {
    Status: true,
    ResponseData: {
      StationOrganConfig: [
        {
          StationConfigID: 4,
          ModelId: 'LEAPMOTOR',
          ModelDesc: 'LEAPMOTOR',
          Station: 'C 208',
          Status: 'COMPLETED',
          Updated_By: 'joy',
          Updated_On: '2025-07-11T09:10:17.4993505',
          Created_By: 'Armand Peugeot',
          Created_On: '2025-06-12T00:00:00',
          StationOrgans: [
            {
              StationConfigID: 4,
              OrganCode: 'CoolingAssembly',
              Status: 'PROCESSING',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'joy',
              Created_On: '2025-07-11T09:15:26.6024231',
            },
            {
              StationConfigID: 4,
              OrganCode: 'HoodLatch',
              Status: 'COMPLETED',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'joy',
              Created_On: '2025-07-11T09:15:33.3187567',
            },
            {
              StationConfigID: 4,
              OrganCode: 'HornTrafficWarning',
              Status: 'PENDING',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'joy',
              Created_On: '2025-07-11T10:16:57.0288216',
            },
            {
              StationConfigID: 4,
              OrganCode: 'Power',
              Status: 'HOLD',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'joy',
              Created_On: '2025-07-11T09:15:10.2557348',
            },
            {
              StationConfigID: 4,
              OrganCode: 'SurroundViewCamera_FRT',
              Status: 'SCRAPPED',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'joy',
              Created_On: '2025-07-11T10:17:37.2031648',
            },
          ],
        },
        {
          StationConfigID: 7,
          ModelId: 'BYD',
          ModelDesc: 'BYD SEAL',
          Station: 'A 115',
          Status: 'PROCESSING',
          Updated_By: 'amelia',
          Updated_On: '2025-09-02T15:45:12.1210000',
          Created_By: 'harry',
          Created_On: '2025-08-18T00:00:00',
          StationOrgans: [
            {
              StationConfigID: 7,
              OrganCode: 'BatteryPack',
              Status: 'STARTED',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'amelia',
              Created_On: '2025-09-02T15:46:10.4510000',
            },
            {
              StationConfigID: 7,
              OrganCode: 'ChargePort',
              Status: 'IN PROGRESS',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'amelia',
              Created_On: '2025-09-02T15:47:22.9510000',
            },
            {
              StationConfigID: 7,
              OrganCode: 'RearCamera',
              Status: 'NEW',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'amelia',
              Created_On: '2025-09-02T15:48:30.0510000',
            },
          ],
        },
        {
          StationConfigID: 9,
          ModelId: 'TESLA',
          ModelDesc: 'MODEL 3',
          Station: 'B 322',
          Status: 'PENDING',
          Updated_By: 'liam',
          Updated_On: '2025-10-12T09:05:44.6000000',
          Created_By: 'sophia',
          Created_On: '2025-10-01T00:00:00',
          StationOrgans: [
            {
              StationConfigID: 9,
              OrganCode: 'FrontRadar',
              Status: 'PROCESSING',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'liam',
              Created_On: '2025-10-12T09:06:30.1000000',
            },
            {
              StationConfigID: 9,
              OrganCode: 'SteeringRack',
              Status: 'COMPLETED',
              Updated_By: null,
              Updated_On: null,
              Created_By: 'liam',
              Created_On: '2025-10-12T09:07:10.7000000',
            },
          ],
        },
      ],
    },
  };

  nestedRows = this.response.ResponseData.StationOrganConfig.map((config) => ({
    ...config,
    OrganCount: config.StationOrgans?.length ?? 0,
  }));

  columns = [
    'StationConfigID',
    'ModelId',
    'ModelDesc',
    'Station',
    'Status',
    'Created_By',
    'Created_On',
    'Updated_By',
    'Updated_On',
    'OrganCount',
  ];

  nestedColumns = [
    'StationConfigID',
    'OrganCode',
    'Status',
    'Created_By',
    'Created_On',
    'Updated_By',
    'Updated_On',
  ];

  onView(row: Record<string, unknown>) {
    this.lastAction = `View clicked for StationConfigID ${row?.['StationConfigID'] ?? ''}`;
  }

  onEdit(row: Record<string, unknown>) {
    this.lastAction = `Edit clicked for StationConfigID ${row?.['StationConfigID'] ?? ''}`;
  }

  onDelete(row: Record<string, unknown>) {
    this.lastAction = `Delete clicked for StationConfigID ${row?.['StationConfigID'] ?? ''}`;
  }

  onNestedView(row: Record<string, unknown>) {
    this.lastAction = `Nested view clicked for OrganCode ${row?.['OrganCode'] ?? ''}`;
  }

  onNestedEdit(row: Record<string, unknown>) {
    this.lastAction = `Nested edit clicked for OrganCode ${row?.['OrganCode'] ?? ''}`;
  }

  onNestedDelete(row: Record<string, unknown>) {
    this.lastAction = `Nested delete clicked for OrganCode ${row?.['OrganCode'] ?? ''}`;
  }
}
