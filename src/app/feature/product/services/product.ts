import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@app/core/services/base-http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private http = inject(BaseHttpService);

  getProduct(id: string): Observable<any> {
    return this.http.get('/product/getby-id?id=' + id);
  }
  searchProduct(params: any): Observable<any> {
    return this.http.post('/product/getby-filter', params);
  }

  updateProduct(body: any): Observable<any> {
    return this.http.post('/product/update', body);
  }
}
