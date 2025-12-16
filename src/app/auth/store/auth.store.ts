// 🏪 AUTH STORE - Quản lý state với Angular Signals

import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthState, User, LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';

/**
 * Auth Store - Quản lý toàn bộ state của Authentication
 * Sử dụng Angular Signals để reactive
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private router = inject(Router);

  // 📊 PRIVATE STATE - Chỉ store mới có thể thay đổi
  private state = signal<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // 🔍 PUBLIC SELECTORS - Components có thể đọc
  readonly user = computed(() => this.state().user);
  readonly accessToken = computed(() => this.state().accessToken);
  readonly refreshToken = computed(() => this.state().refreshToken);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  // Computed để hiển thị tên đầy đủ
  readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  constructor() {
    // Load auth state từ localStorage khi khởi tạo
    this.loadFromLocalStorage();
  }

  // ⚙️ ACTIONS - Các phương thức để thay đổi state

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading,
      error: null // Clear error khi bắt đầu loading
    }));
  }

  /**
   * Set error state
   */
  setError(error: string) {
    this.state.update(state => ({
      ...state,
      error,
      isLoading: false
    }));
  }

  /**
   * Clear error
   */
  clearError() {
    this.state.update(state => ({
      ...state,
      error: null
    }));
  }

  /**
   * Set user sau khi login thành công
   */
  setUser(loginResponse: LoginResponse) {
    const user: User = {
      id: loginResponse.id,
      username: loginResponse.username,
      email: loginResponse.email,
      firstName: loginResponse.firstName,
      lastName: loginResponse.lastName,
      gender: loginResponse.gender,
      image: loginResponse.image
    };

    this.state.update(state => ({
      ...state,
      user,
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
      isAuthenticated: true,
      isLoading: false,
      error: null
    }));

    // Lưu vào localStorage
    this.saveToLocalStorage();
  }

  /**
   * Update tokens sau khi refresh
   */
  updateTokens(accessToken: string, refreshToken: string) {
    this.state.update(state => ({
      ...state,
      accessToken,
      refreshToken
    }));

    // Cập nhật localStorage
    this.saveToLocalStorage();
  }

  /**
   * Clear state khi logout
   */
  logout() {
    this.state.set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });

    // Xóa khỏi localStorage
    this.clearLocalStorage();

    // Redirect về login
    this.router.navigate(['/auth/login']);
  }

  // 💾 LOCAL STORAGE HELPERS

  /**
   * Lưu auth state vào localStorage
   */
  private saveToLocalStorage() {
    const currentState = this.state();
    const dataToSave = {
      user: currentState.user,
      accessToken: currentState.accessToken,
      refreshToken: currentState.refreshToken,
      isAuthenticated: currentState.isAuthenticated
    };
    localStorage.setItem('auth_state', JSON.stringify(dataToSave));
  }

  /**
   * Load auth state từ localStorage
   */
  private loadFromLocalStorage() {
    const saved = localStorage.getItem('auth_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state.update(state => ({
          ...state,
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
          isAuthenticated: parsed.isAuthenticated
        }));
      } catch (error) {
        console.error('Error loading auth state from localStorage:', error);
        this.clearLocalStorage();
      }
    }
  }

  /**
   * Xóa auth state khỏi localStorage
   */
  private clearLocalStorage() {
    localStorage.removeItem('auth_state');
  }
}
