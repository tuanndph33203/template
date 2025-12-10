import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Product } from '../../services/product';
import { Loading } from '@app/shared/ui/loading/loading';
import { NoData } from "@app/shared/ui/no-data/no-data";
import { IProductPayload } from '../../models/product';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Loading, NoData],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss',
})
export class ProductEdit implements OnInit {

  loading = signal<boolean>(true);
  product = signal<IProductPayload | null>(null);

  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  productService = inject(Product);
  fb = inject(FormBuilder);

  form = this.fb.group({
    Id: [''],
    MerchantIds: this.fb.control<string[]>([]),

    Name: ['', Validators.required],
    Code: ['', Validators.required],
    UnitName: ['', Validators.required],
    TimeUsed: [0, Validators.required],
    Price: [0, Validators.required],
    VatRate: [0, Validators.required],
    UrlImage: [''],
  });

  ngOnInit(): void {
    if (this.config.data?.id) {
      this.getProduct(this.config.data.id);
    }
  }

  getProduct(id: string) {
    this.loading.set(true);

    this.productService.getProduct(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res.Code === 200 && res.Data) {
            const data = res.Data;

            this.product.set(data);
            this.form.patchValue({
              Id: data.Id,
              MerchantIds: data.MerchantIds || [],

              Name: data.Name,
              Code: data.Code,
              UnitName: data.UnitName,
              TimeUsed: data.TimeUsed,
              Price: data.Price,
              VatRate: data.VatRate,
              UrlImage: data.UrlImage,
            });
          }
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload: IProductPayload = {
      ...this.form.value,
      MerchantIds: this.form.value.MerchantIds || [],
    } as IProductPayload;

    this.loading.set(true);

    this.productService.updateProduct(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res.Code === 200) {
            this.dialogRef.close({ updated: true });
          }
        }
      });
  }
}
