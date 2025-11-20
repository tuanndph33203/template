import { Component, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { data } from './data';
import { ITableConfig } from '@app/core/model/common';
import { TABLE_COLUMNS } from '@app/core/constants/table';

@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  dataTable = input<any[]>(data);
  columns = input<ITableConfig[]>(TABLE_COLUMNS);
  virtualScroll = input<boolean>(true);
  scrollHeight = input<string>('800px');
  rowHeight = input<number>(48);
  balanceFrozen: boolean = false;

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
}
