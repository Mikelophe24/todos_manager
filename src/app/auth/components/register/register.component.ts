// 📝 REGISTER COMPONENT - Form đăng ký tài khoản

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthStore } from '../../store/auth.store';
import { RegisterRequest } from '../../models/auth.model';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  // Form data
  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  email = signal('');
  firstName = signal('');
  lastName = signal('');
  gender = signal('male'); // ← THÊM MỚI

  // UI state
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  success = signal('');

  // Computed từ store
  isLoading = this.authStore.isLoading;
  error = this.authStore.error;

  /**
   * 📝 XỬ LÝ ĐĂNG KÝ
   */
  onRegister() {
    // Reset messages
    this.success.set('');
    this.authStore.clearError();

    // Validation
    if (!this.validateForm()) {
      return;
    }

    // Mã hóa password
    const encryptedPassword = CryptoJS.SHA256(this.password()).toString();

    // Tạo request data
    const registerData: RegisterRequest = {
      username: this.username(),
      password: encryptedPassword, // ← Password đã mã hóa
      email: this.email(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      gender: this.gender() // ← THÊM MỚI
    };

    // Đăng ký
    this.authService.register(registerData).subscribe({
      next: () => {
        this.success.set('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
        
        // Chuyển về login sau 2 giây
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Register error:', err);
      }
    });
  }

  /**
   * ✅ VALIDATE FORM
   */
  private validateForm(): boolean {
    // Kiểm tra các trường bắt buộc
    if (!this.username() || !this.password() || !this.email() || 
        !this.firstName() || !this.lastName()) {
      this.authStore.setError('Vui lòng điền đầy đủ thông tin!');
      return false;
    }

    // Kiểm tra username length
    if (this.username().length < 3) {
      this.authStore.setError('Username phải có ít nhất 3 ký tự!');
      return false;
    }

    // Kiểm tra password length
    if (this.password().length < 6) {
      this.authStore.setError('Password phải có ít nhất 6 ký tự!');
      return false;
    }

    // Kiểm tra password match
    if (this.password() !== this.confirmPassword()) {
      this.authStore.setError('Password không khớp!');
      return false;
    }

    // Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.authStore.setError('Email không hợp lệ!');
      return false;
    }

    return true;
  }

  /**
   * 👁️ TOGGLE PASSWORD VISIBILITY
   */
  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(show => !show);
  }

  /**
   * 🧹 CLEAR ERROR
   */
  clearError() {
    this.authStore.clearError();
  }
}
