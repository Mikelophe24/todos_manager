import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <button class="back-button" routerLink="/users">
        ← Quay lại danh sách
      </button>

      <div *ngIf="user(); else loading" class="user-detail-card">
        <div class="user-header">
          <div class="user-avatar-large">{{ user()!.name.charAt(0) }}</div>
          <div class="user-title">
            <h1>{{ user()!.name }}</h1>
            <p class="username">@{{ user()!.username }}</p>
          </div>
        </div>

        <div class="detail-grid">
          <!-- Contact Information -->
          <div class="detail-section">
            <h2>📞 Thông tin liên hệ</h2>
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">{{ user()!.email }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Điện thoại:</span>
              <span class="value">{{ user()!.phone }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Website:</span>
              <a [href]="'http://' + user()!.website" target="_blank" class="link">
                {{ user()!.website }}
              </a>
            </div>
          </div>

          <!-- Address Information -->
          <div class="detail-section">
            <h2>📍 Địa chỉ</h2>
            <div class="detail-item">
              <span class="label">Đường:</span>
              <span class="value">{{ user()!.address.street }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Suite:</span>
              <span class="value">{{ user()!.address.suite }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Thành phố:</span>
              <span class="value">{{ user()!.address.city }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Zipcode:</span>
              <span class="value">{{ user()!.address.zipcode }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Tọa độ:</span>
              <span class="value">
                Lat: {{ user()!.address.geo.lat }}, Lng: {{ user()!.address.geo.lng }}
              </span>
            </div>
          </div>

          <!-- Company Information -->
          <div class="detail-section">
            <h2>🏢 Công ty</h2>
            <div class="detail-item">
              <span class="label">Tên công ty:</span>
              <span class="value">{{ user()!.company.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Slogan:</span>
              <span class="value italic">{{ user()!.company.catchPhrase }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Lĩnh vực:</span>
              <span class="value">{{ user()!.company.bs }}</span>
            </div>
          </div>
        </div>

        <!-- Debug Info -->
        <div class="debug-info">
          <h3>🔍 Debug Info - Router Params</h3>
          <p><strong>User ID từ URL:</strong> {{ userId() }}</p>
          <p><strong>User ID từ data:</strong> {{ user()!.id }}</p>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading">
          <div class="spinner"></div>
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </ng-template>

      <div *ngIf="!user() && !isLoading()" class="error">
        <h2>❌ Không tìm thấy người dùng</h2>
        <p>User ID: {{ userId() }}</p>
        <button class="back-button" routerLink="/users">
          Quay lại danh sách
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    .back-button {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 24px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .back-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    .user-detail-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      animation: fadeIn 0.6s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .user-header {
      display: flex;
      align-items: center;
      gap: 24px;
      padding-bottom: 32px;
      border-bottom: 2px solid #f0f0f0;
      margin-bottom: 32px;
    }

    .user-avatar-large {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    }

    .user-title h1 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 2.5rem;
    }

    .username {
      color: #667eea;
      font-size: 1.2rem;
      margin: 0;
      font-weight: 600;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      margin-bottom: 32px;
    }

    .detail-section {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 12px;
      border-left: 4px solid #667eea;
    }

    .detail-section h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.3rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 16px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .label {
      font-size: 0.85rem;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      color: #333;
      font-size: 1rem;
    }

    .italic {
      font-style: italic;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .debug-info {
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 20px;
      margin-top: 24px;
    }

    .debug-info h3 {
      margin: 0 0 12px 0;
      color: #856404;
    }

    .debug-info p {
      margin: 8px 0;
      color: #856404;
      font-family: 'Courier New', monospace;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: white;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading p {
      font-size: 1.2rem;
      margin: 0;
    }

    .error {
      background: white;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .error h2 {
      color: #dc3545;
      margin: 0 0 16px 0;
    }

    .error p {
      color: #666;
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .user-header {
        flex-direction: column;
        text-align: center;
      }

      .user-title h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class UserDetailComponent {
  // ✅ Sử dụng inject() để tránh lỗi initialization
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);

  // 🎯 PHẦN QUAN TRỌNG: Lấy userId từ route params
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );
  

  // Lấy thông tin user dựa trên userId
  user = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      // → Observable<string | null>
      switchMap(id => this.userService.getUserById(Number(id)))
    ),
    { initialValue: null }
  );

  // Computed signal để check loading state
  isLoading = computed(() => this.userId() !== null && this.user() === null);

  constructor() {
    // Log để debug
    console.log('UserDetailComponent initialized');
  }
}
