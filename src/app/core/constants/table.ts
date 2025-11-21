import { ITableConfig } from '../model/common';

export const TABLE_COLUMNS: ITableConfig[] = [
  {
    label: 'STT',
    field: 'index',
    type: 'index',
    minWidth: '50px',
    maxWidth: '80px',
  },
  {
    label: 'Name',
    field: 'name',
    type: 'text',
    minWidth: '200px',
    tooltip: true,
    tooltipField: 'name',
    lineClamp: 1,
  },
  {
    label: 'Id',
    field: 'id',
    type: 'text',
    minWidth: '100px',
  },
  {
    label: 'Country',
    field: 'country',
    type: 'text',
    minWidth: '200px',
  },
  {
    label: 'image',
    field: 'image',
    type: 'image',
    width: '100px',
  },
  {
    label: 'Date',
    field: 'date',
    type: 'date',
    minWidth: '200px',
  },
  {
    label: 'Company',
    field: 'company',
    type: 'text',
    minWidth: '200px',
  },
  {
    label: 'Status',
    field: 'status',
    type: 'badge',
    minWidth: '200px',
    badgeMap: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
    },
    badgeColor: 'info',
  },
  {
    label: 'Activity',
    field: 'activity',
    type: 'text',
    minWidth: '200px',
  },
  {
    label: 'Representative',
    field: 'representative',
    type: 'text',
    minWidth: '200px',
  },
  {
    label: 'Action',
    field: 'action',
    type: 'action',
    minWidth: '200px',
    actionButtons: [
      {
        action: () => {
          console.log('Edit action');
        },
        icon: 'pi pi-pencil',
        tooltipLabel: 'Edit',
      },
      {
        label: 'Delete',
        action: () => {
          console.log('Delete action');
        },
        icon: 'pi pi-trash',
      },
    ],
  },
];
