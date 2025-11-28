import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableMeta } from '@app/shared/table-meta/table-meta';
import { ITableConfig } from '@app/core/model/common';
import { ReportService } from '../../service/report';
import { IInvoiceDetail, IInvoiceItem, ITaxRate } from '@app/core/model/invoice';
import { NumberToVietnamesePipe } from '@app/core/pipe/number-to-vietnamese-pipe';
import { finalize } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TableMeta, NumberToVietnamesePipe],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.scss',
})
export class ReportDetail implements OnInit {
  colsTemp: ITableConfig[] = [
    { label: 'STT', field: 'index', type: 'index', align: 'center' },
    {
      label: 'Tên hàng hóa, dịch vụ',
      field: 'ItemName',
      type: 'text',
      truncate: 25,
      tooltip: true,
      tooltipField: 'ItemName',
    },
    { label: 'Vé', field: 'UnitName', type: 'text', align: 'right', minWidth: '40px' },
    { label: 'DVT', field: 'LineNumber', type: 'text', minWidth: '40px' },
    { label: 'Số lượng', field: 'Quantity', type: 'text', align: 'right' },
    { label: 'Đơn giá trước chiết khẩu', field: 'UnitPrice', type: 'currency', align: 'right' },
    { label: 'Tiền chiết khấu', field: 'DiscountAmountOC', type: 'currency', align: 'right' },
    {
      label: 'Thành tiền trước thuế GTGT',
      field: 'AmountWithoutVATOC',
      type: 'currency',
      align: 'right',
    },
    { label: 'Thuế suất GTGT', field: 'VatRateName', type: 'text' },
    { label: 'Tiền thuế GTGT', field: 'VatAmountOC', type: 'currency', align: 'right' },
    { label: 'Thành tiền sau thuế GTGT', field: 'AmountVATOC', type: 'currency', align: 'right' },
  ];
  summaryColsTemp: ITableConfig[] = [
    { label: 'Tổng hợp', field: 'title', type: 'text' },

    {
      label: 'Thành tiền trước thuế GTGT',
      field: 'AmountWithoutVATOC',
      type: 'currency',
      align: 'right',
    },

    {
      label: 'Tiền thuế GTGT',
      field: 'VatAmountOC',
      type: 'currency',
      align: 'right',
    },

    {
      label: 'Cộng tiền thanh toán',
      field: 'TotalPayment',
      type: 'currency',
      align: 'right',
    },
  ];
  loading = signal(true);
  detail = signal<IInvoiceDetail | null>(null);
  items = signal<IInvoiceItem[]>([]);
  totalDiscount = signal(0);
  grandTotal = signal(0);
  totalInWords = signal(0);
  showPDF = signal(false);
  urlFileInvoice = signal<SafeResourceUrl>('');
  summaryTableData = signal<any[]>([]);

  config = inject(DynamicDialogConfig);
  service = inject(ReportService);
  sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.service
      .getDetailInvoice(this.config.data)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.Code === 200) {
          if (res.Data.IsHaveInoiveFile) {
            this.showPDF.set(true);
            this.urlFileInvoice.set(
              this.sanitizer.bypassSecurityTrustResourceUrl(res.Data.UrlFileInvoice) ?? '',
            );
            return;
          }

          const d: IInvoiceDetail = res.Data;
          this.detail.set(d);

          const listItem = d.ListInvoiceItems.map((item) => ({
            ...item,
            AmountVATOC: (item.VatAmountOC ?? 0) + (item.AmountWithoutVATOC ?? 0),
          }));
          this.items.set(listItem || []);

          // Tổng chiết khấu
          this.totalDiscount.set(
            d.ListInvoiceItems.reduce(
              (sum: number, item: IInvoiceItem) => sum + (item.DiscountAmountOC ?? 0),
              0,
            ),
          );

          this.buildSummaryTable(d);
        }
      });
  }
  private buildSummaryTable(d: IInvoiceDetail): void {
    const items = d.ListInvoiceItems ?? [];
    const taxRates = d.ListTaxRates ?? [];

    // 1. Không kê khai thuế GTGT (không có VatRateName)
    const unDeclareVAT = items
      .filter((i: IInvoiceItem) => !i.VatRateName || i.VatRateName === '')
      .reduce((s, i) => s + (i.AmountWithoutVATOC ?? 0), 0);

    // 2. Không chịu thuế GTGT (Thuế suất 0%)
    const totalVat0 = items
      .filter((i: IInvoiceItem) => i.VatRateName === '0%')
      .reduce((s, i) => s + (i.AmountWithoutVATOC ?? 0), 0);

    // 3. Tổng tiền trước thuế của các mức VAT > 0 (5%, 8%, 10%, ...)
    const taxableWithoutVAT = taxRates.reduce((s, x) => s + (x.AmountWithoutVATOC ?? 0), 0);

    // 4. Tổng VAT
    const totalVAT = taxRates.reduce((s, x) => s + (x.VATAmountOC ?? 0), 0);

    // 5. Tổng cộng trước thuế
    const totalWithoutVAT = unDeclareVAT + totalVat0 + taxableWithoutVAT;

    // 6. Tổng cộng thanh toán (gồm VAT)
    const totalPayment = totalWithoutVAT + totalVAT;

    // Cập nhật grandTotal + tiền bằng chữ theo tổng thanh toán cuối cùng
    this.grandTotal.set(totalPayment);
    this.totalInWords.set(totalPayment);

    // 7. Build data cho bảng summary
    const rows = [
      {
        title: 'Không kê khai thuế GTGT:',
        AmountWithoutVATOC: unDeclareVAT,
        VatAmountOC: 0,
        TotalPayment: unDeclareVAT,
      },
      {
        title: 'Không chịu thuế GTGT:',
        AmountWithoutVATOC: totalVat0,
        VatAmountOC: 0,
        TotalPayment: totalVat0,
      },
      ...taxRates.map((x) => ({
        title: `Thuế suất ${x.VatRateName}:`,
        AmountWithoutVATOC: x.AmountWithoutVATOC,
        VatAmountOC: x.VATAmountOC,
        TotalPayment: x.AmountWithoutVATOC + x.VATAmountOC,
      })),
      {
        title: 'Tổng cộng:',
        AmountWithoutVATOC: totalWithoutVAT,
        VatAmountOC: totalVAT,
        TotalPayment: totalPayment,
        bold: true,
      },
    ];

    this.summaryTableData.set(rows);
  }
}
