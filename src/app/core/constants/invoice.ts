import { ITableAction } from '../model/common';

export enum InvoiceStatus {
  ExportError = -1, // Xuất HĐ lỗi
  Exported = 1, // Xuất
  NotExported = 2, // Chưa xuất
  NoExport = 3, // Không xuất
  AccountantProcess = 4, // Kế toán tự xử lý
}
export enum TransactionTypes {
  NapTheHoiVienGiaTri = 1,
  NapTheHoiVienGoiDichVu = 2,
  NapTheNonameGiaTri = 3,
  NapTheNonameGoiDichVu = 4,
  BanTheGiay = 5,
  DoiThe = 6,
  DichVu = 7,
  XuatAn = 8,
  DoiDiem = 9,
  TraLai = 10,
  SanPham = 11,
}
export enum ProcessType {
  ProcessManual = 0, // Xử lý thủ công
  PublishManual = 1, // Xuất thủ công
}

export const ProcessTypeLabel: Record<ProcessType, string> = {
  [ProcessType.ProcessManual]: 'Xử lý thủ công',
  [ProcessType.PublishManual]: 'Xuất thủ công',
};

export const ProcessTypeOptions = Object.entries(ProcessTypeLabel).map(([key, label]) => ({
  value: Number(key),
  label,
}));

export const InvoiceStatusLabel: Record<InvoiceStatus, string> = {
  [InvoiceStatus.ExportError]: 'Xuất HĐ lỗi',
  [InvoiceStatus.Exported]: 'Đã phát hành',
  [InvoiceStatus.NotExported]: 'Chưa phát hành',
  [InvoiceStatus.NoExport]: 'Hệ thống không xử lý',
  [InvoiceStatus.AccountantProcess]: 'Kế toán tự xử lý',
};

export const InvoiceStatusOptions = Object.entries(InvoiceStatusLabel).map(([key, label]) => ({
  value: Number(key),
  label,
}));

export const TransactionTypesLabel: Record<TransactionTypes, string> = {
  [TransactionTypes.NapTheHoiVienGiaTri]: 'Nạp thẻ hội viên (giá trị)',
  [TransactionTypes.NapTheHoiVienGoiDichVu]: 'Nạp thẻ hội viên (gói dịch vụ)',
  [TransactionTypes.NapTheNonameGiaTri]: 'Nạp thẻ noname (giá trị)',
  [TransactionTypes.NapTheNonameGoiDichVu]: 'Nạp thẻ noname (gói dịch vụ)',
  [TransactionTypes.BanTheGiay]: 'Bán thẻ giấy',
  [TransactionTypes.DoiThe]: 'Đổi thẻ',
  [TransactionTypes.DichVu]: 'Dịch vụ',
  [TransactionTypes.XuatAn]: 'Xuất ăn',
  [TransactionTypes.DoiDiem]: 'Đổi điểm',
  [TransactionTypes.TraLai]: 'Trả lại',
  [TransactionTypes.SanPham]: 'Sản phẩm',
};
export const TransactionTypesOptions = Object.entries(TransactionTypesLabel).map(
  ([key, label]) => ({
    value: Number(key),
    label,
  }),
);

export const actionConfig: ITableAction[] = [
  {
    label: 'Xuất tất cả',
    icon: 'pi pi-file-export',
    type: 'export',
    command: () => {},
  },
];
