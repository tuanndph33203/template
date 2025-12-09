import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@app/core/services/base-http.service';
import { ApiResponse, ApiResponseDetail } from '@app/core/models/common';
import { Observable } from 'rxjs';
import { IInvoice, IInvoiceDetail } from '../models/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(BaseHttpService);

  publishInvoice(refId: string): Observable<any> {
    return this.http.get('/invoice/publish-invoice?refId=' + refId);
  }

  searchInvoice(params: any): Observable<ApiResponse<IInvoice[]>> {
    return this.http.post('/invoice/getby-filter', params);
  }

  getDetailInvoice(refId: string): Observable<ApiResponseDetail<IInvoiceDetail>> {
    return this.http.get('/invoice/get-detail-invoice', { refId });
  }

  getMerchant(): Observable<ApiResponseDetail<any>> {
    return this.http.get('/merchant/getall');
  }

  publishInvoiceManual(refId: string): Observable<any> {
    return this.http.get('/invoice/publish-invoice', { refId });
  }

  downloadInvoices(refIds: string[]): Observable<any> {
    return this.http.post('/invoice/download-invoice', refIds);
  }

  updateInvoice(body: any): Observable<any> {
    return this.http.post('/invoice/update-invoice', body);
  }

  getProduct(params: any): Observable<any> {
    return this.http.post('/product/getby-filter', params);
  }
}
