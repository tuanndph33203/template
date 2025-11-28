import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TABLE_COLUMNS } from '@app/core/constants/table';
import { TableMeta } from '@app/shared/table-meta/table-meta';
import { ReportService } from './service/report';
import { IInvoice, IInvoiceQuery } from '@app/core/model/invoice';
import { ITableAction, LazyLoadEventData } from '@app/core/model/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReportDetail } from './components/report-detail/report-detail';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DatePicker } from 'primeng/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import {
  InvoiceStatusOptions,
  ProcessTypeOptions,
  TransactionTypesOptions,
} from '@app/core/constants/invoice';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
@Component({
  selector: 'app-report',
  imports: [
    TableMeta,
    PaginatorModule,
    DatePicker,
    Select,
    InputTextModule,
    ReactiveFormsModule,
    Toast,
  ],
  templateUrl: './report.html',
  styleUrl: './report.scss',
  providers: [DialogService, MessageService],
})
export class Report implements OnInit {
  colsTemp = TABLE_COLUMNS;
  lastFirst = 0;
  ref: DynamicDialogRef | null = null;

  formSearch = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    merchantId: new FormControl(null),
    documentNumber: new FormControl(''),
    invNo: new FormControl(''),
    customerTax: new FormControl(''),
    customerName: new FormControl(''),
    customerPhone: new FormControl(''),
    status: new FormControl(null),
    note: new FormControl(''),
    paymentType: new FormControl(null),
    requestType: new FormControl(null),
  });

  paymentTypeOptions = TransactionTypesOptions;
  statusOptions = InvoiceStatusOptions;
  processTypeOptions = ProcessTypeOptions;
  branchOptions = signal<any[]>([]);

  data = signal<IInvoice[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(true);

  searchQuery = signal<IInvoiceQuery>({
    page: 1,
    size: 10,
  });

  report = inject(ReportService);
  dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  constructor() {
    effect(() => {
      this.search(this.searchQuery());
    });
  }

  ngOnInit() {
    this.formSearch.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe((filters) => {
        this.searchQuery.update((q) => ({
          ...q,
          page: 1,
          ...filters,
        }));
      });
    this.report.getMerchant().subscribe((res) => {
      if (res.Code === 200) {
        this.branchOptions.set(res.Data);
      }
    });
  }
  search(query: IInvoiceQuery): void {
    const payload = this.cleanQuery(query);

    this.loading.set(true);
    this.report
      .searchInvoice(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.total.set(res.Data.TotalElements);
        this.data.set(res.Data.Content);
      });
  }

  onScroll(event: LazyLoadEventData) {
    if (event.first === this.lastFirst) return;
    this.lastFirst = event.first;

    const nextPage = event.first / event.rows + 1;
    if (nextPage > this.searchQuery().page) {
      this.searchQuery.update((q) => ({ ...q, page: nextPage }));
    }
  }

  handleAction(data: { action: ITableAction; row: IInvoice }): void {
    if (data.action.type === 'view-detail') {
      this.ref = this.dialogService.open(ReportDetail, {
        header: 'Báo cáo hóa đơn chi tiết',
        width: '850px',
        height: '100vh',
        data: data.row.RefId,
        closable: true,
      });
    }
    this.messageService.add({
      severity: 'warning',
      summary: 'Không thể đăng nhập!',
      detail: 'Vui lòng thử lại sau',
    });
    return;
    // if (data.action.type === 'export') {
    //   const a = document.createElement(row.);
    //   a.href = url;
    //   a.download = 'document.pdf'; // ← tuỳ đổi tên
    //   a.click();
    // }
  }

  onPageChange(event: PaginatorState) {
    this.searchQuery.update((q) => ({
      ...q,
      page: (event.page ?? 0) + 1,
      size: event.rows ?? q.size,
    }));
  }

  private cleanQuery<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
    ) as Partial<T>;
  }
}
