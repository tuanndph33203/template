import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '@app/core/models/auth';
import { AuthStore } from '@app/feature/auth/services/auth.store';
import { Branch } from '@app/feature/branch/services/branch';
import { IProductCart, IProductDetail } from '@app/feature/product/models/product';
import { Product } from '@app/feature/product/services/product';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { ScrollerLazyLoadEvent, ScrollerModule } from 'primeng/scroller';
import { LazyLoadEventData } from '@app/core/models/common';

@Component({
  selector: 'app-sales-list',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ScrollerModule,
    SelectButtonModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './sales-list.html',
  styleUrl: './sales-list.scss',
})
export class SalesList implements OnInit {
  today = new Date().toISOString().substring(0, 10);
  lastFirst = 0;
  products = signal<IProductDetail[]>([]);

  loading = signal<boolean>(true);
  total = signal<number>(0);
  formSearch = new FormGroup({
    TextFilter: new FormControl(null),
    MerchantCode: new FormControl('17'),
  });
  branchOptions = signal<any[]>([]);
  cart = signal<IProductCart[]>([]);
  user = signal<IUser | null>(null);
  searchQuery = signal<any>({
    page: 1,
    size: 15,
    MerchantCode: '17',
  });

  authStore = inject(AuthStore);
  subTotal = computed(() => this.cart().reduce((sum, item) => sum + item.Price * item.qty, 0));
  totalVat = computed(() =>
    this.cart().reduce((sum, item) => sum + (item.Price * item.qty * item.VatRate) / 100, 0),
  );
  discountValue = computed(() => 0);
  grandTotal = computed(() => this.subTotal() + this.totalVat() - this.discountValue());

  private productService = inject(Product);
  private branchService = inject(Branch);

  constructor() {
    effect(() => {
      this.search(this.searchQuery());
    });
  }

  ngOnInit(): void {
    this.user.set(this.authStore.getUser());
    this.branchService.getMerchant().subscribe((res) => {
      if (res.Code === 200) {
        this.branchOptions.set(res.Data);
      }
    });

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
  }
  search(query: any): void {
    const payload = this.cleanQuery(query);
    this.loading.set(true);
    this.productService
      .searchProduct(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.total.set(res.Data?.TotalElements);
        const newItems = res.Data?.Content || [];
        this.products.update((old) => [...old, ...newItems]);
      });
  }

  onScroll(event: ScrollerLazyLoadEvent) {
    if (this.searchQuery().size * this.searchQuery().page >= this.total()) return;
    const currentLength = this.products().length;

    if (event.last >= currentLength - 3) {
      this.searchQuery.update((q) => ({
        ...q,
        page: q.page + 1,
      }));
    }
  }
  addToCart(p: IProductDetail) {
    this.cart.update((c: IProductCart[]) => {
      const index = c.findIndex((item) => item.Id === p.Id);

      if (index !== -1) {
        const clone = [...c];
        clone[index] = {
          ...clone[index],
          qty: clone[index].qty + 1,
        };
        return clone;
      }

      return [
        ...c,
        {
          Id: p.Id,
          Name: p.Name,
          Price: p.Price,
          qty: 1,
          UnitName: p.UnitName,
          VatRate: p.VatRate,
          Code: p.Code || '',
          TimeUsed: p.TimeUsed || 0,
          IsDelete: p.IsDelete || false,
          UrlImage: p.UrlImage || '',
        },
      ];
    });
  }

  increaseQty(id: string) {
    this.cart.update((c) =>
      c.map((item) => (item.Id === id ? { ...item, qty: item.qty + 1 } : item)),
    );
  }
  decreaseQty(id: string) {
    this.cart.update((c) =>
      c.flatMap((item) => {
        if (item.Id !== id) return item;
        if (item.qty <= 1) return [];
        return { ...item, qty: item.qty - 1 };
      }),
    );
  }
  removeFromCart(id: string) {
    this.cart.update((c) => c.filter((item) => item.Id !== id));
  }

  private cleanQuery<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
    ) as Partial<T>;
  }
}
