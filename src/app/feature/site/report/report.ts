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
import { FloatLabelModule } from 'primeng/floatlabel';
import { debounceTime, delay, distinctUntilChanged, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-report',
  imports: [
    TableMeta,
    PaginatorModule,
    DatePicker,
    Select,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './report.html',
  styleUrl: './report.scss',
  providers: [DialogService],
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
    size: 20,
  });

  reportService = inject(ReportService);
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
        debounceTime(600),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe((filters) => {
        this.searchQuery.update((q) => ({
          ...q,
          page: 1,
          ...filters,
        }));
      });
    this.reportService.getMerchant().subscribe((res) => {
      if (res.Code === 200) {
        this.branchOptions.set(res.Data);
      }
    });
  }
  search(query: IInvoiceQuery, firstLoad?: boolean): void {
    console.log(query);
    const page = query.page ?? 1;
    const size = query.size ?? 20;
    const payload = this.cleanQuery(query);
    this.loading.set(true);

    this.reportService
      .searchInvoice(payload)
      .pipe(
        delay(400),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        this.total.set(res.Data.TotalElements);
        if (firstLoad) {
          this.data.set(new Array(this.total()).fill(null));
          return;
        }
        const start = (page - 1) * size;
        this.data.update((prev) => {
          const clone = [...prev];
          clone.splice(start, size, ...res.Data.Content);
          return clone;
        });
      });
  }

  fillPage(page: number, size: number) {}

  onScroll(event: LazyLoadEventData) {
    if (event.first === this.lastFirst) return;
    this.lastFirst = event.first;
    const nextPage = Math.ceil(event.first / event.rows + 1);
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
    if (data.action.type === 'publish') {
      this.reportService
        .publishInvoice(data.row.RefId)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (res) => {
            if (res.Code === 200) {
            } else {
              this.messageService.clear();
              this.messageService.add({
                severity: 'info',
                summary: 'Đã xảy ra lỗi khi phát hành!',
                detail: res.Message,
              });
              return;
            }
          },
          error: (err) => {
            console.log('❌ Lỗi:', err.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Phát hành thất bại',
              detail: Object.values(err.error.errors).join(' | '),
            });
          },
        });
    }

    if (data.action.type === 'download') {
      this.reportService
        .getDetailInvoice(data.row.RefId)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((res) => {
          if (res.Code === 200) {
            if (res.Data.IsHaveInoiveFile) {
              window.open(res.Data.UrlFileInvoice, '_blank');
            } else {
              this.messageService.clear();
              this.messageService.add({
                severity: 'info',
                summary: 'Hóa đơn chưa phát hành!',
                detail: 'Vui lòng thử lại sau',
              });
              return;
            }
          }
        });
    }
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
