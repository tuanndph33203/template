import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ITableAction, ITableConfig } from '@app/core/models/common';
import { AuthStore } from '@app/feature/auth/services/auth.store';;
import { TableMeta } from '@app/shared/ui/table-meta/table-meta';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { finalize } from 'rxjs';
import { Branch } from '../../services/branch';
import { colsTempList } from '../../constant/branch';

@Component({
  selector: 'app-branch-list',
  imports: [TableMeta, ReactiveFormsModule, FloatLabelModule, SelectModule],
  templateUrl: './branch-list.html',
  styleUrl: './branch-list.scss',
})
export class BranchList {
  branch = signal<any[]>([])
  total = signal<number>(0);
  loading = signal<boolean>(true);

  colsTemp = signal<ITableConfig[] | null>(null)

  branchOptions = signal<any[]>([]);

  private branchService = inject(Branch);
  private authStore = inject(AuthStore);

  constructor() {
    effect(() => {
      this.search();
    });
  }

  ngOnInit(): void {
    this.colsTemp.set(colsTempList({ role: this.authStore.user?.role }))
  }

  search(): void {
    this.loading.set(true);
    this.branchService.getMerchant()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.branch.set(res.Data);
      });
  }
}
