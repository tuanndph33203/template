import { ITableConfig } from '../model/common';
import { InvoiceStatus, InvoiceStatusLabel } from './invoice';

export const TABLE_COLUMNS: ITableConfig[] = [
  { label: 'STT', field: 'Index', type: 'index', minWidth: '40px', align: 'center' },

  { label: 'Ngày', field: 'DocumentDate', type: 'text', minWidth: '90px' },
  { label: 'CT No', field: 'DocumentNumber', type: 'text', minWidth: '130px' },
  { label: 'Chi nhánh', field: 'MerchantName', type: 'text', minWidth: '140px' },
  { label: 'Mã KH', field: 'CustomerCode', type: 'text', minWidth: '80px' },
  { label: 'Di động', field: 'CustomerPhone', type: 'text', minWidth: '90px' },
  { label: 'Tên KH', field: 'CustomerName', type: 'text', minWidth: '120px', tooltip: true },

  { label: 'CCC', field: 'CustomerIdNumber', type: 'text', minWidth: '100px' },
  { label: 'Tên công ty', field: 'CustomerEmployeeName', type: 'text', minWidth: '150px' },
  { label: 'Địa chỉ', field: 'CustomerAddress', type: 'text', minWidth: '200px', tooltip: true },

  { label: 'Mã số thuế', field: 'CustomerTax', type: 'text', minWidth: '90px' },
  { label: 'Số hợp đồng', field: 'ContractNo', type: 'text', minWidth: '100px' },

  { label: 'Loại giao dịch', field: 'TypeService', type: 'text', minWidth: '120px' },

  {
    label: 'Tổng tiền chưa VAT chưa chiết khấu',
    field: 'TotalSaleAmountOC',
    type: 'currency',
    minWidth: '150px',
  },
  { label: 'Chiết khấu', field: 'TotalDiscountAmountOC', type: 'currency', minWidth: '150px' },
  {
    label: 'Tổng tiền chưa thuế',
    field: 'TotalAmountWithoutVATOC',
    type: 'currency',
    minWidth: '150px',
  },
  { label: 'Giá trị thanh toán', field: 'TotalAmountOC', type: 'currency', minWidth: '150px' },

  {
    label: 'Trạng thái',
    field: 'Status',
    type: 'transform',
    minWidth: '150px',
    transformFn: (v) => InvoiceStatusLabel[v as InvoiceStatus],
  },

  { label: 'Yêu cầu', field: 'Request', type: 'text', minWidth: '140px' },
  {
    label: 'Ghi chú',
    field: 'Notes',
    type: 'text',
    minWidth: '160px',
    truncate: 50,
    tooltip: true,
    tooltipField: 'Notes',
  },

  { label: 'Số HĐ', field: 'InvoiceNumber', type: 'text', minWidth: '140px' },
  { label: 'Ngày HĐ', field: 'InvoiceDate', type: 'text', minWidth: '150px' },
  { label: 'Mã CQT', field: 'TaxCode', type: 'text', minWidth: '140px' },

  { label: 'Người xuất', field: 'User', type: 'text', minWidth: '140px' },

  {
    label: 'Thao tác',
    field: 'Action',
    type: 'action',
    minWidth: '100px',
    actionButtons: [
      {
        icon: 'pi pi-eye',
        tooltipLabel: 'Xem chi tiết',
        type: 'view-detail',
      },
      {
        icon: 'pi pi-file-export',
        tooltipLabel: 'Xuất',
        type: 'export',
      },
    ],
  },
];
