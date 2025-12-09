import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table-report-detail',
  standalone: true,
  imports: [FormsModule, InputNumber, InputText, CommonModule, TableModule],
  templateUrl: './table-report-detail.html',
  styleUrl: './table-report-detail.scss',
})
export class TableReportDetail {
  // ✅ DATA TỪ CHA
  invoiceItems = input<any[]>([]);

  // ✅ EVENT GỬI NGƯỢC LÊN CHA
  changed = output<{ field: string; value: any; row: number }>();

  // ✅ STATE CELL ĐANG EDIT
  editingCell = signal<{ rowIndex: number; field: string } | null>(null);

  // ========================
  // ✅ EDIT CELL
  // ========================
  startEdit(rowIndex: number, field: string) {
    this.editingCell.set({ rowIndex, field });
  }

  stopEdit() {
    this.editingCell.set(null);
  }

  isEditing(rowIndex: number, field: string) {
    const cell = this.editingCell();
    return !!cell && cell.rowIndex === rowIndex && cell.field === field;
  }

  // ========================
  // ✅ PHÁT SỰ KIỆN SỬA GIÁ TRỊ
  // ========================
  onInputNumberChange(rowIndex: number, field: string, value: any) {
    this.changed.emit({ row: rowIndex, field, value });
  }

  // ✅ khi sửa thành tiền → báo cho cha
  onAmountChange(rowIndex: number, value: any) {
    this.changed.emit({
      row: rowIndex,
      field: 'AmountWithoutVATOC',
      value,
    });
  }

  // ✅ khi sửa VAT → báo cho cha
  onVatChange(rowIndex: number, value: any) {
    this.changed.emit({
      row: rowIndex,
      field: 'VatRateName',
      value,
    });
  }

  // ✅ khi sửa tiền thuế → báo cha
  onVatAmountChange(rowIndex: number, value: any) {
    this.changed.emit({
      row: rowIndex,
      field: 'VatAmountOC',
      value,
    });
  }
}
