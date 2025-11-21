import { Component, input, OnInit, output, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { ITableConfig } from '@app/core/model/common';
import { Popover } from 'primeng/popover';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { TruncatePipe } from '@app/core/pipe/truncate-pipe';
import { TABLE_COLUMNS } from '@app/core/constants/table';
import { data } from './data';
@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    Popover,
    InputGroupAddonModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    CheckboxModule,
    TooltipModule,
    TruncatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table implements OnInit {
  dataTable = input<any[]>(data);
  columns = input<ITableConfig[]>(TABLE_COLUMNS);
  virtualScroll = input<boolean>(true);
  scrollHeight = input<string>('800px');
  rowHeight = input<number>(48);
  totalData = input<number>(0);
  showFrozen = input<boolean>(true);
  currentPage = input<number>(1);
  pageSize = input<number>(10);
  showColumnToggle = input<boolean>(true);

  actionClick = output<{ action: string; row: any }>();

  actionFrozen = signal<boolean>(false);

  formModelColumn: any = {};
  formSubmitted: boolean = false;
  selectedRows: any[] = [];
  allSelected = false;

  ngOnInit() {
    this.columns().forEach((col) => {
      this.formModelColumn[col.field] = !col.visible; // true = hiển thị
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
      // Lấy tất cả data của trang hiện tại
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
    this.actionClick.emit({
      action: btn.actionType, // ví dụ 'edit', 'delete', 'view'
      row: row,
    });
  }
}
