// 👤 PROFILE COMPONENT - Trang profile chi tiết

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private authService = inject(AuthService);
  authStore = inject(AuthStore);

  // UI state
  isRefreshing = signal(false);

  // Computed values
  user = this.authStore.user;
  fullName = this.authStore.fullName;
  accessToken = this.authStore.accessToken;
  refreshToken = this.authStore.refreshToken;

  /**
   * Test refresh token manually
   */
  onRefreshToken() {
    this.isRefreshing.set(true);
    
    this.authService.refreshToken().subscribe({
      next: () => {
        this.isRefreshing.set(false);
        alert('✅ Token đã được refresh thành công!');
      },
      error: (err) => {
        this.isRefreshing.set(false);
        alert('❌ Refresh token thất bại!');
        console.error('Refresh error:', err);
      }
    });
  }

  /**
   * Logout
   */
  onLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      this.authService.logout();
    }
  }

  /**
   * Copy token to clipboard
   */
  copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`✅ ${type} đã được copy vào clipboard!`);
    });
  }
}
