// 📊 DASHBOARD COMPONENT - Trang chủ sau khi login

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Inject store để lấy data
  authStore = inject(AuthStore);

  // Computed values từ store
  user = this.authStore.user;
  fullName = this.authStore.fullName;
  isAuthenticated = this.authStore.isAuthenticated;

  /**
   * Logout
   */
  onLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      this.authService.logout();
    }
  }

  /**
   * Test API call với token
   */
  onTestApiCall() {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        alert('✅ API call thành công! Check console để xem data.');
        console.log('Current user data:', data);
      },
      error: (err) => {
        alert('❌ API call thất bại! Check console để xem lỗi.');
        console.error('API error:', err);
      }
    });
  }
}
