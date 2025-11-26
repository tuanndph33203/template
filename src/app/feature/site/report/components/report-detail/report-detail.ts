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
    { label: 'Tên hàng hóa, dịch vụ', field: 'ItemName', type: 'text' },
    { label: 'Vé', field: '', type: 'text', align: 'right', minWidth: '40px' },
    { label: 'DVT', field: '', type: 'text', minWidth: '40px' },
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

  detail = signal<IInvoiceDetail | null>(null);
  items = signal<IInvoiceItem[]>([]);
  totalDiscount = signal(0);
  totalVat0 = signal(0);
  vat10Amount = signal(0);
  vat10Tax = signal(0);
  vat10Total = signal(0);
  grandTotal = signal(0);
  vat10Base = signal(0);
  totalInWords = signal(0);
  summaryTableData = signal<any[]>([]);

  config = inject(DynamicDialogConfig);
  service = inject(ReportService);

  ngOnInit(): void {
    this.service.getDetailInvoice(this.config.data).subscribe((res) => {
      if (res.Code === 200) {
        const d: IInvoiceDetail = res.Data;
        this.detail.set(d);
        const listItem = d.ListInvoiceItems.map((item) => ({
          ...item,
          AmountVATOC: item.VatAmountOC + item.AmountWithoutVATOC,
        }));
        this.items.set(listItem || []);
        this.totalDiscount.set(
          d.ListInvoiceItems.reduce(
            (sum: number, item: IInvoiceItem) => sum + (item.DiscountAmountOC ?? 0),
            0,
          ),
        );

        this.totalVat0.set(
          d.ListInvoiceItems.filter((item: IInvoiceItem) => item.VatRateName === '0%').reduce(
            (sum: number, item: IInvoiceItem) => sum + (item.AmountWithoutVATOC ?? 0),
            0,
          ),
        );
        const vat10: ITaxRate | undefined = d.ListTaxRates.find(
          (x: ITaxRate) => x.VatRateName === '10%',
        );

        this.vat10Amount.set(vat10?.VatAmountOC ?? 0);

        this.vat10Total.set((vat10?.AmountWithoutVATOC ?? 0) + (vat10?.VatAmountOC ?? 0));

        this.grandTotal.set(
          d.ListInvoiceItems.reduce(
            (sum: number, item: IInvoiceItem) => sum + (item.AmountOC ?? 0),
            0,
          ),
        );
        const total = d.ListInvoiceItems.reduce(
          (s: number, i: IInvoiceItem) => s + (i.AmountOC ?? 0),
          0,
        );
        this.grandTotal.set(total);
        this.totalInWords.set(total);
        this.summaryTableData.set([
          {
            title: 'Không kê khai thuế GTGT:',
            AmountWithoutVATOC: null,
            VatAmountOC: null,
            TotalPayment: null,
          },
          {
            title: 'Không chịu thuế GTGT:',
            AmountWithoutVATOC: this.totalVat0(),
            VatAmountOC: null,
            TotalPayment: this.totalVat0(),
          },
          ...d.ListTaxRates.map((x) => ({
            title: `Thuế suất ${x.VatRateName}:`,
            AmountWithoutVATOC: x.AmountWithoutVATOC,
            VatAmountOC: x.VatAmountOC,
            TotalPayment: x.AmountWithoutVATOC + x.VatAmountOC,
          })),
          {
            title: 'Tổng cộng:',
            AmountWithoutVATOC: null,
            VatAmountOC: null,
            TotalPayment: this.grandTotal(),
            bold: true,
          },
        ]);
      }
    });
  }
}
