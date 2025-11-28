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

  // =============== APPLICATION ===============
  createApp(body: any): Observable<any> {
    return this.http.post('/api/application/create', body);
  }

  getAppKey(appId: string) {
    return this.http.get('/api/application/get-key', { AppId: appId });
  }

  // =============== MERCHANT ===============
  createMerchant(body: any) {
    return this.http.post('/api/merchant', body);
  }

  setupMerchantVat(body: any) {
    return this.http.post('/api/merchant/setup-vat', body);
  }

  setupInvSeri(body: any): Observable<any> {
    return this.http.post('/api/merchant/setup-invseri', body);
  }

  // =============== VAT CONFIG ===============
  createVat(body: any): Observable<any> {
    return this.http.post('/api/vatconfig', body);
  }

  // =============== INVOICE ===============
  publishInvoice(body: any): Observable<any> {
    return this.http.post('/api/syncdata', body);
  }

  searchInvoice(params: any): Observable<ApiResponse<IInvoice[]>> {
    return this.http.post('/api/syncdata/getby-filter', params);
  }

  getDetailInvoice(refId: string): Observable<ApiResponseDetail<IInvoiceDetail>> {
    return this.http.get('/api/syncdata/get-detail-invoice', { refId });
  }

  getMerchant(): Observable<ApiResponseDetail<any>> {
    return this.http.get('/api/merchant/getall');
  }

  publishInvoiceManual(refId: string): Observable<any> {
    return this.http.get('/api/syncdata/publish-invoice', { refId });
  }
}
