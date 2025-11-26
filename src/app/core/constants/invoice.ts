import { ITableAction } from '../model/common';

export enum InvoiceStatus {
  Exported = 1, // Xuất
  NotExported = 2, // Chưa xuất
  NoExport = 3, // Không xuất
  AccountantProcess = 4, // Kế toán tự xử lý
  PrepareExported = 5, // Chuẩn bị xuất
}
export const InvoiceStatusLabel: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Exported]: 'Xuất',
  [InvoiceStatus.NotExported]: 'Chưa xuất',
  [InvoiceStatus.NoExport]: 'Không xuất',
  [InvoiceStatus.AccountantProcess]: 'Kế toán tự xử lý',
  [InvoiceStatus.PrepareExported]: 'Chuẩn bị xuất',
};
export const actionConfig: ITableAction[] = [
  {
    label: 'Xuất tất cả',
    icon: 'pi pi-file-export',
    type: 'export',
    command: () => {},
  },
];
