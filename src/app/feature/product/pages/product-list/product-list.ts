import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { IInvoiceQuery } from '@app/feature/report/models/report';
import { Product } from '../../services/product';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { TableMeta } from '@app/shared/ui/table-meta/table-meta';
import { Paginator, PaginatorState } from 'primeng/paginator';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReportService } from '@app/feature/report/services/report';
import { Select, SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { ITableAction, ITableConfig } from '@app/core/models/common';
import { ProductDetail } from '../product-detail/product-detail';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthStore } from '@app/feature/auth/services/auth.store';
import { ProductEdit } from '../product-edit/product-edit';
import { colsTempList } from '../../constants/table';
import { Branch } from '@app/feature/branch/services/branch';

@Component({
  selector: 'app-product-list',
  imports: [
    TableMeta,
    Paginator,
    ReactiveFormsModule,
    FloatLabelModule,
    SelectModule,
    InputText,
    Select,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  formSearch = new FormGroup({
    TextFilter: new FormControl(null),
    MerchantCode: new FormControl(null),
  });
  products = signal<any[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(true);

  colsTemp = signal<ITableConfig[] | null>(null);

  branchOptions = signal<any[]>([]);

  searchQuery = signal<any>({
    page: 1,
    size: 15,
  });
  private productService = inject(Product);
  private branchService = inject(Branch);
  private dialogService = inject(DialogService);
  private authStore = inject(AuthStore);

  constructor() {
    effect(() => {
      this.search(this.searchQuery());
    });
  }

  ngOnInit(): void {
    this.colsTemp.set(colsTempList({ role: this.authStore.user?.role }));
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
    this.branchService.getMerchant().subscribe((res) => {
      if (res.Code === 200) {
        this.branchOptions.set(res.Data);
        this.formSearch.patchValue({ MerchantCode: this.branchOptions()[0]?.Code || '0' });
      }
    });
  }

  search(query: any): void {
    if (!query.MerchantCode) {
      return;
    }
    const payload = this.cleanQuery(query);
    this.loading.set(true);
    this.productService
      .searchProduct(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.total.set(res.Data?.TotalElements);
        this.products.set(res.Data?.Content);
      });
  }

  onPageChange(event: PaginatorState) {
    this.searchQuery.update((q) => ({
      ...q,
      page: (event.page ?? 0) + 1,
      size: event.rows ?? q.size,
    }));
  }

  handleAction(data: { action: ITableAction; row: any }): void {
    if (data.action.type === 'view-detail') {
      this.dialogService.open(ProductDetail, {
        header: 'Chi tiết sản phẩm',
        width: '800px',
        height: '420px',
        data: {
          id: data.row.Id,
        },
        closable: true,
      });
    }
    if (data.action.type === 'edit') {
      this.dialogService.open(ProductEdit, {
        header: 'Chỉnh sửa sản phẩm',
        width: '800px',
        height: '450px',
        data: {
          id: data.row.Id,
        },
        closable: true,
      });
    }
  }

  private cleanQuery<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
    ) as Partial<T>;
  }
}
