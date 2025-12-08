import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableMeta } from '@app/shared/ui/table-meta/table-meta';
import { ITableConfig } from '@app/core/models/common';
import { ReportService } from '../../services/report';
import { NumberToVietnamesePipe } from '@app/shared/pipes/number-to-vietnamese-pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IInvoiceDetail, IInvoiceItem } from '../../models/report';
import { colsTempDetail, colsTempEdit, colsTempSummary } from '../../constants/table';
import { TooltipModule } from 'primeng/tooltip';
import { Loading } from '@app/shared/ui/loading/loading';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TableMeta,
    NumberToVietnamesePipe,
    TooltipModule,
    Loading,
    ReactiveFormsModule,
  ],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.scss',
})
export class ReportDetail implements OnInit {
  colsTempSummary: ITableConfig[] = colsTempSummary;
  colsTemp = signal<ITableConfig[]>([]);

  loading = signal(true);
  detail = signal<IInvoiceDetail | null>(null);
  items = signal<IInvoiceItem[]>([]);
  totalDiscount = signal(0);
  grandTotal = signal(0);
  totalInWords = signal(0);
  showPDF = signal(false);
  edition = signal(false);
  urlFileInvoice = signal<SafeResourceUrl>('');
  summaryTableData = signal<any[]>([]);
  listItems = signal<any[]>([]);

  editingField = signal<string | null>(null);

  invoiceForm = new FormGroup({
    Type: new FormControl(1, Validators.required),
    RefId: new FormControl('', Validators.required),
    CustomerName: new FormControl('', Validators.required),
    CustomerCompanyName: new FormControl(''),
    CustomerTaxCode: new FormControl(''),
    CustomerAddress: new FormControl('', Validators.required),
    CustomerPhone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{9,11}$/)]),
    CustomerIDNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(12),
    ]),
    Products: new FormArray<FormGroup>([], Validators.required),
  });

  config = inject(DynamicDialogConfig);
  service = inject(ReportService);
  sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.getInvoice();
    if (this.config.data.edition) {
      this.edition.set(true);
      this.colsTemp.set(colsTempEdit);
    } else {
      this.colsTemp.set(colsTempDetail);
    }
  }
  getInvoice() {
    this.service.getDetailInvoice(this.config.data.id).subscribe({
      next: (res) => {
        if (res.Code === 200) {
          if (res.Data.IsHaveInoiveFile) {
            this.showPDF.set(true);
            this.urlFileInvoice.set(
              this.sanitizer.bypassSecurityTrustResourceUrl(res.Data.UrlFileInvoice) ?? '',
            );
            return;
          }

          const d: IInvoiceDetail = res.Data;
          this.invoiceForm.patchValue({
            Type: 1,
            RefId: d.RefId,
            CustomerName: d.BuyerInvoice.BuyerFullName,
            CustomerCompanyName: d.BuyerInvoice.BuyerLegalName,
            CustomerTaxCode: d.BuyerInvoice.BuyerTaxCode,
            CustomerAddress: d.BuyerInvoice.BuyerAddress,
            CustomerPhone: d.BuyerInvoice.BuyerPhoneNumber,
            CustomerIDNumber: d.BuyerInvoice.BuyerIdNumber,
          });
          this.detail.set(d);

          const listItem = d.ListInvoiceItems.map((item) => ({
            ...item,
            AmountVATOC: (item.VatAmountOC ?? 0) + (item.AmountWithoutVATOC ?? 0),
          }));
          this.items.set(listItem || []);
          this.listItems.set(listItem || []);

          this.totalDiscount.set(
            d.ListInvoiceItems.reduce(
              (sum: number, item: IInvoiceItem) => sum + (item.DiscountAmountOC ?? 0),
              0,
            ),
          );

          this.buildSummaryTable(d);
        }
      },
      error: () => {
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
  addRow() {
    this.items.update((prev) => [...prev, {}]);
  }
  onChangeInvoice(event: { field: string; value: any; row: number }) {
    const { field, value, row } = event;

    this.listItems.update((prev) => {
      const clone = [...prev];
      clone[row] = { ...clone[row], [field]: value };
      return clone;
    });

    console.log('Updated items:', this.items());
  }
  submitForm() {
    this.invoiceForm.patchValue({});
  }

  startEdit(field: string) {
    this.editingField.set(field);
  }

  stopEdit() {
    this.editingField.set(null);
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
