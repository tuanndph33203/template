import { CommonModule } from '@angular/common';
import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { AutoCompleteCompleteEvent } from 'primeng/types/autocomplete';
import { AutoComplete } from 'primeng/autocomplete';
import { IInvoiceItem } from '../../models/report';
import { Tooltip } from "primeng/tooltip";
@Component({
  selector: 'app-table-report-detail',
  standalone: true,
  imports: [FormsModule, InputNumber, CommonModule, TableModule, AutoComplete, Tooltip],
  templateUrl: './table-report-detail.html',
  styleUrl: './table-report-detail.scss',
})
export class TableReportDetail {
  invoiceItems = input<IInvoiceItem[]>([]);
  productItems = input<any[]>([]);

  filteredProducts = signal(this.invoiceItems())

  changed = output<{ field: string; value: any; row: number }>();

  editingCell = signal<{ rowIndex: number; field: string } | null>(null);
  constructor() {
    effect(() => {
      const products = this.productItems();
      this.filteredProducts.set(products);
    });
  }
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

  onInputNumberChange(rowIndex: number, field: string, value: any) {
    this.changed.emit({ row: rowIndex, field, value });
  }

  onNameChange(rowIndex: number, quantity: number | undefined, value: any) {
    this.changed.emit({
      row: rowIndex,
      field: 'ItemCode',
      value: value.Code,
    });
    this.changed.emit({
      row: rowIndex,
      field: 'ItemName',
      value: value.Name,
    });
    this.changed.emit({
      row: rowIndex,
      field: 'UnitPrice',
      value: value.Price,
    });
    this.changed.emit({
      row: rowIndex,
      field: 'VatRate',
      value: value.VatRate,
    });
    this.changed.emit({
      row: rowIndex,
      field: 'VatRateName',
      value: value.VatRate + '%',
    });
    this.changed.emit({
      row: rowIndex,
      field: 'UnitName',
      value: value.UnitName,
    });
    this.onNumberChange(rowIndex, quantity, 'Quantity')
  }

  onNumberChange(rowIndex: number, value: any, field: string) {
    const rowData = this.invoiceItems()[rowIndex]
    if (rowData.Quantity && rowData.UnitPrice) {
      this.changed.emit({
        row: rowIndex,
        field: 'AmountWithoutVATOC',
        value: rowData.Quantity * rowData.UnitPrice,
      });
      if (rowData.VatRate) {
        this.changed.emit({
          row: rowIndex,
          field: 'VatAmountOC',
          value: rowData.Quantity * rowData.UnitPrice / rowData.VatRate,
        });
      }

    }

    this.changed.emit({
      row: rowIndex,
      field,
      value,
    });
  }

  filterProduct(event: AutoCompleteCompleteEvent) {
    const query = event.query?.trim();
    if (!query) {
      this.filteredProducts.set(this.productItems());
      return;
    }
    const regex = new RegExp(query, 'i');
    this.filteredProducts.set(
      this.productItems().filter(item => regex.test(item.Name))
    );
  }

}
