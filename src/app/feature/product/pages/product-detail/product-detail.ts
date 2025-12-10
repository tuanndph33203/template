import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../services/product';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { finalize } from 'rxjs';
import { Loading } from '@app/shared/ui/loading/loading';
import { NoData } from "@app/shared/ui/no-data/no-data";

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage, Loading, NoData],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {

  product = signal<any>(null)
  loading = signal<boolean>(true);

  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  private productService = inject(Product)
  ngOnInit(): void {
    if (this.config.data.id) {
      this.getProduct(this.config.data.id);
    }

  }

  getProduct(productId: string) {
    this.loading.set(true)
    this.productService.getProduct(productId).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (res) => {
        if (res.Code === 200) {
          this.product.set(res.Data)
        }
      }
    });
  }
}
