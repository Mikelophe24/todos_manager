// 🛡️ AUTH GUARD - Bảo vệ routes yêu cầu authentication

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';

/**
 * Auth Guard - Functional Guard (Angular 15+)
 * 
 * Kiểm tra user đã đăng nhập chưa:
 * - Nếu đã đăng nhập: cho phép truy cập
 * - Nếu chưa: redirect về /auth/login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isAuthenticated = authStore.isAuthenticated();

  if (isAuthenticated) {
    console.log('✅ Auth Guard: User authenticated, access granted');
    return true;
  } else {
    console.log('❌ Auth Guard: User not authenticated, redirecting to login');
    // Lưu URL người dùng muốn truy cập để redirect sau khi login
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
};

/**
 * Guest Guard - Ngược lại với Auth Guard
 * 
 * Dùng cho trang login/register:
 * - Nếu đã đăng nhập: redirect về dashboard
 * - Nếu chưa: cho phép truy cập
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isAuthenticated = authStore.isAuthenticated();

  if (!isAuthenticated) {
    console.log('✅ Guest Guard: User not authenticated, access granted');
    return true;
  } else {
    console.log('❌ Guest Guard: User already authenticated, redirecting to dashboard');
    return router.createUrlTree(['/auth/dashboard']);
  }
};
