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

  publishInvoice(refId: string): Observable<any> {
    return this.http.get('/syncdata/publish-invoice?refId=' + refId);
  }

  searchInvoice(params: any): Observable<ApiResponse<IInvoice[]>> {
    return this.http.post('/syncdata/getby-filter', params);
  }

  getDetailInvoice(refId: string): Observable<ApiResponseDetail<IInvoiceDetail>> {
    return this.http.get('/syncdata/get-detail-invoice', { refId });
  }

  getMerchant(): Observable<ApiResponseDetail<any>> {
    return this.http.get('/merchant/getall');
  }

  publishInvoiceManual(refId: string): Observable<any> {
    return this.http.get('/syncdata/publish-invoice', { refId });
  }
}
