// 🛡️ AUTH INTERCEPTOR - Tự động attach token và xử lý 401 errors

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor - Functional Interceptor (Angular 15+)
 * 
 * Nhiệm vụ:
 * 1. Tự động thêm accessToken vào header của mọi request
 * 2. Bắt lỗi 401 (Unauthorized)
 * 3. Tự động refresh token và retry request
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);

  // Lấy accessToken từ store
  const accessToken = authStore.accessToken();

  // Clone request và thêm Authorization header nếu có token
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // Gửi request
  return next(authReq).pipe(
    catchError(error => {
      // 🔴 Xử lý lỗi 401 - Token hết hạn
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        console.log('🔄 Token expired, attempting refresh...');

        // Thử refresh token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // ✅ Refresh thành công - Retry request với token mới
            const newToken = authStore.accessToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            console.log('✅ Retrying request with new token');
            return next(retryReq);
          }),
          catchError(refreshError => {
            // ❌ Refresh thất bại - Logout user
            console.error('❌ Refresh failed, logging out');
            authStore.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Các lỗi khác - throw ra ngoài
      return throwError(() => error);
    })
  );
};
