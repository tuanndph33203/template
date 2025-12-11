import { ITableConfig } from '@app/core/models/common';
import { InvoiceStatus, InvoiceStatusLabel } from './report';

export const colsTempList: ITableConfig[] = [
  { label: 'STT', field: 'Index', type: 'index', minWidth: '40px', align: 'center' },

  { label: 'Ngày', field: 'DocumentDate', type: 'text', minWidth: '90px' },
  { label: 'Số c.từ', field: 'DocumentNumber', type: 'text', minWidth: '130px' },
  { label: 'Chi nhánh', field: 'MerchantName', type: 'text', minWidth: '140px' },
  { label: 'Mã KH', field: 'CustomerCode', type: 'text', minWidth: '80px' },
  { label: 'Di động', field: 'CustomerPhone', type: 'text', minWidth: '90px' },
  { label: 'Tên KH', field: 'CustomerName', type: 'text', minWidth: '120px', tooltip: true },

  { label: 'CCCD', field: 'CustomerIdNumber', type: 'text', minWidth: '100px' },
  { label: 'Tên công ty', field: 'CustomerEmployeeName', type: 'text', minWidth: '150px' },
  { label: 'Địa chỉ', field: 'CustomerAddress', type: 'text', minWidth: '200px', tooltip: true },

  { label: 'Mã số thuế', field: 'CustomerTax', type: 'text', minWidth: '90px' },
  { label: 'Số hợp đồng', field: 'ContractNo', type: 'text', minWidth: '100px' },

  { label: 'Loại giao dịch', field: 'TypeService', type: 'text', minWidth: '120px' },

  {
    label: 'Tổng tiền chưa VAT, chưa chiết khấu',
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
        tooltipLabel: 'Phát hành',
        type: 'publish',
        visible: (v) => v.Status === InvoiceStatus.NotExported,
      },
      {
        icon: 'pi pi-download',
        tooltipLabel: 'Tải xuống',
        type: 'download',
        visible: (v) => v.Status === InvoiceStatus.Exported,
      },
      {
        icon: 'pi pi-file-edit',
        tooltipLabel: 'Chỉnh sửa',
        type: 'edit',
        visible: (v) =>
          v.Status === InvoiceStatus.AccountantProcess || v.Status === InvoiceStatus.ExportError,
      },
    ],
  },
];

export const colsTempDetail: ITableConfig[] = [
  { label: 'STT', field: 'index', type: 'index', align: 'center', minWidth: '30px' },

  {
    label: 'Tên hàng hóa, dịch vụ',
    field: 'ItemName',
    type: 'text',
    truncate: 25,
    tooltip: true,
    tooltipField: 'ItemName',
    minWidth: '150px',
  },

  { label: 'DVT', field: 'LineNumber', type: 'text', minWidth: '40px', align: 'center' },

  { label: 'Số lượng', field: 'Quantity', type: 'text', align: 'right', minWidth: '40px' },

  {
    label: 'Đơn giá',
    field: 'UnitPrice',
    type: 'currency',
    align: 'right',
    minWidth: '90px',
  },

  {
    label: 'Thành tiền',
    field: 'AmountWithoutVATOC',
    type: 'currency',
    align: 'right',
    minWidth: '100px',
  },

  { label: 'Thuế suất GTGT', field: 'VatRateName', type: 'text', minWidth: '80px' },

  {
    label: 'Tiền thuế GTGT',
    field: 'VatAmountOC',
    type: 'currency',
    align: 'right',
    minWidth: '100px',
  },
];

export const colsTempSummary: ITableConfig[] = [
  { label: 'Tổng hợp', field: 'title', type: 'text' },

  {
    label: 'Thành tiền trước thuế GTGT',
    field: 'AmountWithoutVATOC',
    type: 'currency',
    align: 'right',
  },

  {
    label: 'Tiền thuế GTGT',
    field: 'VatAmountOC',
    type: 'currency',
    align: 'right',
  },

  {
    label: 'Cộng tiền thanh toán',
    field: 'TotalPayment',
    type: 'currency',
    align: 'right',
  },
];
