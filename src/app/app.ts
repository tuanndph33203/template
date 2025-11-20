import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Table } from './shared/table/table';
interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TableModule, Table],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  products!: any[];

  cols!: Column[];

  constructor() {}

  ngOnInit() {}
}
