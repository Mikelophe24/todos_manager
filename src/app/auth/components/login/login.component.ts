// 🔐 LOGIN COMPONENT

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Form data
  username = signal('emilys');  // Default username để test nhanh
  password = signal('emilyspass');  // Default password để test nhanh

  // UI state
  showPassword = signal(false);

  // Computed từ store
  isLoading = this.authStore.isLoading;
  error = this.authStore.error;

  /**
   * Xử lý login
   */
  onLogin() {
    const credentials = {
      username: this.username(),
      password: this.password(),
      expiresInMins: 30
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        // ✅ Login thành công
        // Lấy returnUrl từ query params (nếu có)
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        // ❌ Login thất bại - Error đã được xử lý trong service
        console.error('Login error:', err);
      }
    });
  }

  /**
   * Toggle hiển thị password
   */
  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  /**
   * Clear error khi user bắt đầu nhập lại
   */
  clearError() {
    this.authStore.clearError();
  }
}
