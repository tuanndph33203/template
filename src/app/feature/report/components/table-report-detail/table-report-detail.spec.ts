import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReportDetail } from './table-report-detail';

describe('TableReportDetail', () => {
  let component: TableReportDetail;
  let fixture: ComponentFixture<TableReportDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableReportDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableReportDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
