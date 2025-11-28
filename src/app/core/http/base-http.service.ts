import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class BaseHttpService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(url: string, params?: Record<string, any>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http
      .get<T>(`${this.baseUrl}${url}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any, params?: Record<string, any>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http
      .post<T>(`${this.baseUrl}${url}`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: any, params?: Record<string, any>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http
      .put<T>(`${this.baseUrl}${url}`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string, params?: Record<string, any>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http
      .delete<T>(`${this.baseUrl}${url}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  private handleError(error: any) {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
