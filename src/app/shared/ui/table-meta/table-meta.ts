import { TooltipModule } from 'primeng/tooltip';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ITableAction, ITableActionEvent, ITableConfig } from '@app/core/models/common';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Popover } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ToggleButton } from 'primeng/togglebutton';
import { TruncatePipe } from '@app/shared/pipes/truncate-pipe';
import { Menu } from 'primeng/menu';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InputNumber, InputNumberInputEvent } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-table-meta',
  imports: [
    CommonModule,
    Popover,
    ToggleButton,
    ButtonModule,
    TableModule,
    Checkbox,
    FormsModule,
    TooltipModule,
    NgOptimizedImage,
    TruncatePipe,
    Menu,
    ScrollingModule,
    InputNumber,
    InputTextModule
  ],
  templateUrl: './table-meta.html',
  styleUrl: './table-meta.scss',
})
export class TableMeta implements OnInit {
  dataTable = input.required<any[]>();
  columns = input.required<ITableConfig[]>();

  scrollHeight = input<string>('600px');
  rowHeight = input<number>(41);
  totalData = input<number>(0);
  currentPage = input<number>(1);
  pageSize = input<number>(10);

  showNodata = input<boolean>(false);
  showLoading = input<boolean>(false);
  showTotalRecord = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  showFrozen = input<boolean>(false);
  showColumnToggle = input<boolean>(false);
  showCheckboxToggle = input<boolean>(false);
  showRefresh = input<boolean>(false);
  actionsTable = input<ITableAction[]>([]);

  actionClick = output<ITableActionEvent>();
  actionLazyload = output<any>();
  actionChangeInput = output<{ value: string | number, field: string, row: number }>();
  actionRefresh = output();
  actionFrozen = signal<boolean>(false);
  formModelColumn: any = {};
  formSubmitted: boolean = false;
  selectedRows: any[] = [];
  allSelected = false;
  editingCell = signal<{ rowIndex: number; field: string } | null>(null);

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

  onActionClick(btn: ITableAction, row: any) {
    btn?.command?.();
    this.actionClick.emit({
      action: btn,
      row: row,
    });
  }

  onScroll(event: any) {
    this.actionLazyload.emit(event);
  }

  onRefresh() {
    this.actionRefresh.emit();
  }


  startEdit(rowIndex: number, field: string) {
    this.editingCell.set({ rowIndex, field })
  }

  stopEdit() {
    this.editingCell.set(null)
  }

  onTextChange(event: Event, field: string, row: number): void {
    const value = (event.target as HTMLInputElement).value;
    this.actionChangeInput.emit({ field, value, row })

  }

  onNumberChange(event: InputNumberInputEvent, field: string, row: number): void {
    const value = event.value ?? '';
    this.actionChangeInput.emit({ field, value, row })

  }

  toggleMenu(event: MouseEvent, popover: any) {
    event.preventDefault();
    event.stopPropagation();
    popover.toggle(event);
  }
}
