import { TooltipModule } from 'primeng/tooltip';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ITableAction, ITableConfig } from '@app/core/model/common';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Popover } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ToggleButton } from 'primeng/togglebutton';
import { TruncatePipe } from '@app/core/pipe/truncate-pipe';
@Component({
  selector: 'app-table-meta',
  imports: [
    CommonModule,
    Popover,
    ToggleButton,
    Button,
    TableModule,
    Checkbox,
    FormsModule,
    TooltipModule,
    NgOptimizedImage,
    TruncatePipe,
  ],
  templateUrl: './table-meta.html',
  styleUrl: './table-meta.scss',
})
export class TableMeta implements OnInit {
  dataTable = input.required<any[]>();
  columns = input.required<ITableConfig[]>();

  scrollHeight = input<string>('800px');
  rowHeight = input<number>(48);
  totalData = input<number>(0);
  currentPage = input<number>(1);
  pageSize = input<number>(10);

  showTotalRecord = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  showFrozen = input<boolean>(false);
  showColumnToggle = input<boolean>(false);
  showCheckboxToggle = input<boolean>(false);

  actionClick = output<{ action: string; row: any }>();
  actionFrozen = signal<boolean>(false);

  formModelColumn: any = {};
  formSubmitted: boolean = false;
  selectedRows: any[] = [];
  allSelected = false;

  ngOnInit() {
    this.columns().forEach((col) => {
      this.formModelColumn[col.field] = !col.visible;
    });
  }
  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  isAtLeastOneSelected(): boolean {
    return Object.values(this.formModelColumn).some((v) => v === true);
  }

  isInvalid(): boolean {
    return this.formSubmitted && !this.isAtLeastOneSelected();
  }
  onSubmit(op: Popover) {
    this.formSubmitted = true;

    if (this.isAtLeastOneSelected()) {
      this.columns().forEach((col) => {
        col.visible = !this.formModelColumn[col.field];
      });
      this.formSubmitted = false;
    }
    op.hide();
  }

  getIndex(i: number): number {
    return (this.currentPage() - 1) * this.pageSize() + i + 1;
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.checked;
    if (this.allSelected) {
      this.selectedRows = [...this.dataTable()];
    } else {
      this.selectedRows = [];
    }
  }
  toggleRow(row: any, event: any) {
    if (event.checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter((r) => r !== row);
    }
  }
  totalSelected() {
    return this.selectedRows.length;
  }

  onActionClick(btn: any, row: any) {
    btn.action();
    this.actionClick.emit({
      action: btn.actionType,
      row: row,
    });
  }

  toggleMenu(event: MouseEvent, popover: any) {
    event.preventDefault();
    event.stopPropagation();
    popover.toggle(event);
  }
}
