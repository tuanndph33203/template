import { Component, effect, inject, signal } from '@angular/core';
import { TABLE_COLUMNS } from '@app/core/constants/table';
import { TableMeta } from '@app/shared/table-meta/table-meta';
import { ReportService } from './service/report';
import { IInvoice, IInvoiceQuery } from '@app/core/model/invoice';
import { ITableAction, LazyLoadEventData } from '@app/core/model/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReportDetail } from './components/report-detail/report-detail';
@Component({
  selector: 'app-report',
  imports: [TableMeta],
  templateUrl: './report.html',
  styleUrl: './report.scss',
  providers: [DialogService],
})
export class Report {
  data = signal<IInvoice[]>([]);
  total = signal<number>(0);
  colsTemp = TABLE_COLUMNS;
  lastFirst = 0;
  ref: DynamicDialogRef | null = null;
  report = inject(ReportService);
  dialogService = inject(DialogService);

  searchQuery = signal<IInvoiceQuery>({
    page: 1,
    size: 20,
  });

  constructor() {
    effect(() => {
      const query = this.searchQuery();
      this.search(query, query.page === 1);
    });
  }

  search(query: IInvoiceQuery, firstload?: boolean): void {
    this.report.searchInvoice(query).subscribe((res) => {
      this.total.set(res.Data.TotalElements);
      if (firstload) {
        this.data.set(res.Data.Content);
      } else {
        this.data.update((prev) => [...prev, ...res.Data.Content]);
      }
    });
  }

  onScroll(event: LazyLoadEventData) {
    console.log({
      first: event.first,
      last: event.first + event.rows,
      rows: event.rows,
      page: event.first / event.rows + 1,
      dataLength: this.data().length,
      totalRecords: this.total(),
      scrollHeight: '550px',
      expectedItemsInView: Math.floor(parseInt('550px') / 41),
    });
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
        closable: true,
        width: '800px',
        height: '100%',
        data: data.row.RefId,
      });
    }
  }
}
