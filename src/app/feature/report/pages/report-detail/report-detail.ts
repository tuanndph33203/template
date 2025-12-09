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
import { colsTempDetail, colsTempSummary } from '../../constants/table';
import { TooltipModule } from 'primeng/tooltip';
import { Loading } from '@app/shared/ui/loading/loading';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableReportDetail } from '../../components/table-report-detail/table-report-detail';
import { MessageService } from 'primeng/api';

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
    TableReportDetail,
  ],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.scss',
})
export class ReportDetail implements OnInit {
  colsTempSummary: ITableConfig[] = colsTempSummary;
  colsTemp = colsTempDetail;

  loading = signal(true);
  detail = signal<IInvoiceDetail | null>(null);
  items = signal<IInvoiceItem[]>([]);
  products = signal<any[]>([]);

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
    Type: new FormControl(0),
    RefId: new FormControl(''),
    CustomerName: new FormControl(''),
    CustomerCompanyName: new FormControl(''),
    CustomerTaxCode: new FormControl(''),
    CustomerAddress: new FormControl(''),
    CustomerPhone: new FormControl('', [Validators.pattern(/^[0-9]{9,11}$/)]),
    CustomerIDNumber: new FormControl('', [
      Validators.minLength(9),
      Validators.maxLength(12),
    ]),
    Products: new FormArray<FormGroup>([]),
  });

  config = inject(DynamicDialogConfig);
  service = inject(ReportService);
  sanitizer = inject(DomSanitizer);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getInvoice();
    if (this.config.data.edition) {
      this.edition.set(true);
    }
  }
  getProduct(branchId: string) {
    const searchQuery = {
      page: 1,
      size: 1000,
      MerchantCode: branchId
    }
    this.service.getProduct(searchQuery).subscribe({
      next: (res) => {
        if (res.Code === 200) {
          this.products.set(res.Data.Content)
          console.log(res.Data.Content);

        }
      }

    });
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
          this.getProduct(d.MerchantInvoice?.Code)
          this.invoiceForm.patchValue({
            RefId: d.RefId,
            CustomerName: d.BuyerInvoice?.BuyerFullName,
            CustomerCompanyName: d.BuyerInvoice?.BuyerLegalName,
            CustomerTaxCode: d.BuyerInvoice?.BuyerTaxCode,
            CustomerAddress: d.BuyerInvoice?.BuyerAddress,
            CustomerPhone: d.BuyerInvoice?.BuyerPhoneNumber,
            CustomerIDNumber: d.BuyerInvoice?.BuyerIdNumber,
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

          this.buildSummaryTable(d.ListInvoiceItems, d.ListTaxRates);
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
    this.items.update((prev) => {
      const clone = [...prev];
      clone[row] = { ...clone[row], [field]: value };
      return clone;
    });
    const taxRates = this.buildTaxRates(this.items())
    console.log(taxRates);

    this.buildSummaryTable(this.items(), taxRates)
  }

  submitForm(type: 0 | 1) {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const formValue = this.invoiceForm.getRawValue();
    const products = this.items().map(item => ({
      ItemCode: item.ItemCode ?? '',
      ItemName: item.ItemName ?? '',
      Quantity: item.Quantity ?? 0,
      UnitPrice: item.UnitPrice ?? 0,
      AmountOC: item.AmountOC ?? 0,
      DiscountAmountOC: item.DiscountAmountOC ?? 0,
      VatRate: item.VatRate ?? parseFloat(item.VatRateName ?? '0') / 100,
      UnitName: item.UnitName ?? ''
    }));
    const payload = {
      Type: type,
      RefId: formValue.RefId,
      CustomerName: formValue.CustomerName,
      CustomerCompanyName: formValue.CustomerCompanyName,
      CustomerTaxCode: formValue.CustomerTaxCode,
      CustomerAddress: formValue.CustomerAddress,
      CustomerPhone: formValue.CustomerPhone,
      CustomerIDNumber: formValue.CustomerIDNumber,

      Products: products

    };

    this.service.updateInvoice(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Thành công!',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Thất bại',
          detail: Object.values(err.error.errors).join(' | '),
        });
      }
    });
  }


  startEdit(field: string) {
    this.editingField.set(field);
  }

  stopEdit() {
    this.editingField.set(null);
  }
  private buildTaxRates(items: IInvoiceItem[]) {
    return Object.values(
      items.reduce((acc, item) => {
        if (!item.VatRateName) return acc;

        const vatKey = item.VatRateName;

        if (!acc[vatKey]) {
          acc[vatKey] = {
            VatRateName: vatKey,
            AmountWithoutVATOC: 0,
            VATAmountOC: 0,
          };
        }

        acc[vatKey].AmountWithoutVATOC += item.AmountWithoutVATOC ?? 0;
        acc[vatKey].VATAmountOC += item.VatAmountOC ?? 0;

        return acc;
      }, {} as Record<string, any>)
    );
  }

  private buildSummaryTable(items: any[], taxRates: any[]): void {
    const unDeclareVAT = items
      .filter((i: IInvoiceItem) => !i.VatRateName || i.VatRateName === '')
      .reduce((s, i) => s + (i.AmountWithoutVATOC ?? 0), 0);

    const totalVat0 = items
      .filter((i: IInvoiceItem) => i.VatRateName === '0%')
      .reduce((s, i) => s + (i.AmountWithoutVATOC ?? 0), 0);
    const taxableWithoutVAT = taxRates.reduce((s, x) => s + (x.AmountWithoutVATOC ?? 0), 0);
    const totalVAT = taxRates.reduce((s, x) => s + (x.VATAmountOC ?? 0), 0);
    const totalWithoutVAT = unDeclareVAT + totalVat0 + taxableWithoutVAT;
    const totalPayment = totalWithoutVAT + totalVAT;
    this.grandTotal.set(totalPayment);
    this.totalInWords.set(totalPayment);
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
