import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeuix/themes/material';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Material,
      },
      translation: {
        firstDayOfWeek: 1,
        dayNames: [
          "Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"
        ],
        dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        monthNames: [
          "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
          "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ],
        monthNamesShort: [
          "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"
        ],
        today: "Hôm nay",
        clear: "Xóa",
        dateFormat: 'dd/mm/yy'
      }
    }),
    { provide: LOCALE_ID, useValue: 'vi-VN' },
  ],
};
