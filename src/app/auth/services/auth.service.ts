// 🔐 AUTH SERVICE - Xử lý các API calls liên quan đến Authentication

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, finalize, map, switchMap } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse,
  RegisterRequest 
} from '../models/auth.model';
import * as CryptoJS from 'crypto-js';

/**
 * Auth Service - Xử lý login, logout, refresh token, register
 * 
 * ✅ Đã chuyển sang JSON Server (localhost:3000)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);

  // ✅ MỚI - JSON Server
  private readonly API_URL = 'http://localhost:3000';

  /**
   * 🔑 LOGIN - Đăng nhập với JSON Server
   * 
   * Flow:
   * 1. Lấy tất cả users từ JSON Server
   * 2. Mã hóa password và tìm user khớp
   * 3. Tạo fake tokens
   * 4. Lưu vào store
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.authStore.setLoading(true);

    // Mã hóa password để so sánh
    const hashedPassword = CryptoJS.SHA256(credentials.password).toString();

    return this.http.get<any[]>(`${this.API_URL}/users`).pipe(
      map(users => {
        // Tìm user khớp username và password (đã hash)
        const user = users.find(u => 
          u.username === credentials.username && 
          u.password === hashedPassword
        );

        if (!user) {
          throw new Error('Username hoặc password không đúng!');
        }

        // Tạo fake tokens (trong production dùng JWT thật)
        const fakeToken = btoa(JSON.stringify({ 
          id: user.id, 
          username: user.username,
          exp: Date.now() + 30 * 60 * 1000 // 30 phút
        }));

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          image: user.image,
          accessToken: fakeToken,
          refreshToken: fakeToken
        };
      }),
      tap(response => {
        this.authStore.setUser(response);
        console.log('✅ Login successful:', response);
      }),
      catchError(error => {
        const errorMessage = error.message || 'Đăng nhập thất bại';
        this.authStore.setError(errorMessage);
        console.error('❌ Login failed:', error);
        return throwError(() => error);
      }),
      finalize(() => this.authStore.setLoading(false))
    );
  }

  /**
   * 📝 REGISTER - Đăng ký user mới
   * 
   * Flow:
   * 1. Kiểm tra username đã tồn tại chưa
   * 2. Tạo user mới trong JSON Server
   * 3. Trả về thông tin user
   */
  register(data: RegisterRequest): Observable<any> {
    this.authStore.setLoading(true);

    return this.http.get<any[]>(`${this.API_URL}/users`).pipe(
      switchMap(users => {
        // Kiểm tra username đã tồn tại
        const existingUser = users.find(u => u.username === data.username);
        if (existingUser) {
          throw new Error('Username đã tồn tại!');
        }

        // Kiểm tra email đã tồn tại
        const existingEmail = users.find(u => u.email === data.email);
        if (existingEmail) {
          throw new Error('Email đã được sử dụng!');
        }

        // Tạo user mới
        const newUser = {
          username: data.username,
          password: data.password,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender || 'other',
          image: `https://i.pravatar.cc/150?img=${users.length + 1}`,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        // POST user mới vào JSON Server
        return this.http.post(`${this.API_URL}/users`, newUser);
      }),
      tap(response => {
        console.log('✅ Register successful:', response);
      }),
      catchError(error => {
        const errorMessage = error.message || 'Đăng ký thất bại';
        this.authStore.setError(errorMessage);
        console.error('❌ Register failed:', error);
        return throwError(() => error);
      }),
      finalize(() => this.authStore.setLoading(false))
    );
  }


  /**
   * 🔄 REFRESH TOKEN - Làm mới access token
   * 
   * JSON Server không có endpoint /refresh
   * Nên ta tạo fake tokens mới (trong production dùng JWT thật)
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const currentRefreshToken = this.authStore.refreshToken();
    const currentUser = this.authStore.user();

    if (!currentRefreshToken || !currentUser) {
      console.error('❌ No refresh token or user available');
      this.authStore.logout();
      return throwError(() => new Error('No refresh token'));
    }

    // Tạo fake tokens mới
    const newAccessToken = btoa(JSON.stringify({ 
      id: currentUser.id, 
      username: currentUser.username,
      exp: Date.now() + 30 * 60 * 1000 // 30 phút
    }));

    const newRefreshToken = btoa(JSON.stringify({ 
      id: currentUser.id, 
      username: currentUser.username,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 ngày
    }));

    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        const response: RefreshTokenResponse = {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        };

        this.authStore.updateTokens(response.accessToken, response.refreshToken);
        console.log('✅ Token refreshed successfully');
        
        observer.next(response);
        observer.complete();
      }, 100);
    });
  }

  /**
   * 🚪 LOGOUT - Đăng xuất
   */
  logout() {
    this.authStore.logout();
    console.log('👋 User logged out');
  }

  /**
   * 🔍 GET CURRENT USER - Lấy thông tin user hiện tại
   * 
   * JSON Server không có endpoint /me
   * Nên ta lấy user từ store hoặc từ /users/:id
   */
  getCurrentUser(): Observable<any> {
    const currentUser = this.authStore.user();
    
    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }

    // Lấy user từ JSON Server theo ID
    return this.http.get(`${this.API_URL}/users/${currentUser.id}`)
      .pipe(
        tap(user => {
          console.log('✅ Current user:', user);
        }),
        catchError(error => {
          console.error('❌ Get current user failed:', error);
          return throwError(() => error);
        })
      );
  }
}
