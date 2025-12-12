import { inject, Injectable } from '@angular/core';
import { ApiResponseDetail } from '@app/core/models/common';
import { BaseHttpService } from '@app/core/services/base-http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Branch {
  private http = inject(BaseHttpService);
  getMerchant(): Observable<ApiResponseDetail<any>> {
    return this.http.get('/merchant/getall');
  }
}
