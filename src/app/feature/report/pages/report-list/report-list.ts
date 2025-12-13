import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TableMeta } from '@app/shared/ui/table-meta/table-meta';

import { ITableAction, LazyLoadEventData } from '@app/core/models/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DatePicker } from 'primeng/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
  InvoiceStatusOptions,
  ProcessTypeOptions,
  TransactionTypesOptions,
} from '../../constants/report';
import { IInvoice, IInvoiceQuery } from '../../models/report';
import { ReportService } from '../../services/report';
import { ReportDetail } from '../report-detail/report-detail';
import { colsTempList } from '../../constants/table';
@Component({
  selector: 'app-report-list',
  imports: [
    TableMeta,
    PaginatorModule,
    DatePicker,
    Select,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss',
})
export class ReportList {
  colsTemp = colsTempList;
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

  private reportService = inject(ReportService);
  private dialogService = inject(DialogService);
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
  search(query: IInvoiceQuery): void {
    const payload = this.cleanQuery(query);
    this.loading.set(true);
    this.reportService
      .searchInvoice(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.total.set(res.Data?.TotalElements);
        this.data.set(res.Data?.Content);
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
        data: {
          id: data.row.RefId,
        },
        closable: true,
      });
    }
    if (data.action.type === 'edit') {
      this.dialogService
        .open(ReportDetail, {
          header: 'Chỉnh sửa hóa đơn',
          width: '850px',
          height: '100vh',
          data: {
            id: data.row.RefId,
            edition: true,
          },
          closable: true,
        })
        ?.onClose.subscribe((ok) => {
          if (ok) {
            this.search(this.searchQuery());
          }
        });
    }
    if (data.action.type === 'publish') {
      this.hanlePublish(data);
    }

    if (data.action.type === 'download') {
      this.hanleDownload(data);
    }
  }
  hanlePublish(data: { action: ITableAction; row: IInvoice }) {
    this.reportService
      .publishInvoice(data.row.RefId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res.Code === 200) {
            this.messageService.add({
              severity: 'info',
              summary: res.Message,
            });
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

  hanleDownload(data: { action: ITableAction; row: IInvoice }) {
    this.messageService.add({
      severity: 'info',
      summary: 'Đang xử lý...',
      detail: 'Đang tải hóa đơn, vui lòng chờ',
      life: 5000,
    });
    this.reportService
      .downloadInvoices([data.row.RefId])
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.Code === 200) {
          if (res.Data) {
            const list = JSON.parse(res.Data) as Array<{
              TransactionID: string;
              Data: string;
              ErrorCode?: string;
            }>;

            if (!list.length) {
              this.messageService.add({
                severity: 'info',
                summary: 'Không có dữ liệu PDF',
              });
              return;
            }
            list.forEach((item) => {
              if (!item.Data) return;

              const base64 = item.Data;
              const fileName = `${data.row.DocumentNumber}_${data.row.InvoiceNumber}_${data.row.DocumentDate}.pdf`;

              const byteCharacters = atob(base64);
              const byteNumbers = new Array(byteCharacters.length);

              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }

              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'application/pdf' });

              const url = URL.createObjectURL(blob);

              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();

              a.remove();
              URL.revokeObjectURL(url);
              this.messageService.clear();
            });
          } else {
            this.messageService.clear();
            this.messageService.add({
              severity: 'info',
              summary: 'Tải hóa đơn thất bại!',
              detail: 'Vui lòng thử lại sau',
            });
            return;
          }
        }
      });
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
