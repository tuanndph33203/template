import { ITableConfig } from '../model/common';

export const TABLE_COLUMNS: ITableConfig[] = [
  { label: 'STT', field: 'index', type: 'index', width: '40px' },

  { label: 'Ngày', field: 'date', type: 'date', minWidth: '70px' },
  { label: 'CT No', field: 'ctNo', type: 'text', minWidth: '80px' },
  { label: 'Chi nhánh', field: 'branch', type: 'text', minWidth: '140px' },
  { label: 'Mã KH', field: 'code', type: 'text', minWidth: '80px' },
  { label: 'SĐT', field: 'phone', type: 'text', minWidth: '90px' },
  { label: 'Khách hàng', field: 'customer', type: 'text', minWidth: '120px', tooltip: true },

  { label: 'CCC', field: 'ccc', type: 'text', minWidth: '100px' },
  { label: 'Công ty', field: 'company', type: 'text', minWidth: '150px' },
  { label: 'Địa chỉ', field: 'address', type: 'text', minWidth: '200px', tooltip: true },

  { label: 'Mã số thuế', field: 'taxCode', type: 'text', minWidth: '90px' },
  { label: 'Hợp đồng', field: 'contract', type: 'text', minWidth: '100px' },

  { label: 'Loại', field: 'type', type: 'text', minWidth: '120px' },

  { label: 'Tổng tiền', field: 'total', type: 'currency', minWidth: '150px' },
  { label: 'Giảm giá', field: 'discount', type: 'currency', minWidth: '150px' },
  { label: 'Thuế', field: 'tax', type: 'currency', minWidth: '150px' },
  { label: 'Thanh toán', field: 'payment', type: 'currency', minWidth: '150px' },

  {
    label: 'Trạng thái',
    field: 'status',
    type: 'badge',
    minWidth: '150px',
    badgeMap: {
      'Đã phát hành': 'success',
      'Chưa phát hành': 'warning',
      'Đã hủy': 'danger',
    },
  },

  { label: 'Yêu cầu', field: 'request', type: 'text', minWidth: '140px' },
  { label: 'Ghi chú', field: 'description', type: 'text', minWidth: '160px', tooltip: true },

  { label: 'Số hoá đơn', field: 'invoiceNo', type: 'text', minWidth: '140px' },
  { label: 'Ngày hoá đơn', field: 'invoiceDate', type: 'date', minWidth: '150px' },
  { label: 'Mã CQT', field: 'cqtCode', type: 'text', minWidth: '140px' },

  { label: 'Người tạo', field: 'user', type: 'text', minWidth: '140px' },

  {
    label: 'Thao tác',
    field: 'action',
    type: 'action',
    width: '200px',
    minWidth: '200px',
    actionButtons: [
      {
        label: 'Xem',
        icon: 'pi pi-eye',
        action: () => {},
        tooltipLabel: 'Xem chi tiết',
        children: [
          {
            label: 'Xem',
            icon: 'pi pi-eye',
            action: () => {},
            tooltipLabel: 'Xem chi tiết',
          },
        ],
      },
      {
        label: 'Sửa',
        icon: 'pi pi-pencil',
        action: () => {},
        tooltipLabel: 'Chỉnh sửa',
      },
    ],
  },
];
