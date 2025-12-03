import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@app/core/http/base-http.service';
import { ApiResponse, ApiResponseDetail } from '@app/core/model/common';
import { IInvoice, IInvoiceDetail } from '@app/core/model/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(BaseHttpService);
  private httpClient = inject(HttpClient);

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
}
