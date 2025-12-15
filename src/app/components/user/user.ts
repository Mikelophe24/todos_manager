import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Danh Sách Người Dùng</h1>
      
      <div *ngIf="users(); else loading" class="user-grid">
        <div *ngFor="let user of users()" 
             class="user-card"
             [routerLink]="['/users', user.id]">
          <div class="user-header">
            <div class="user-avatar">{{ user.name.charAt(0) }}</div>
            <h2>{{ user.name }}</h2>
          </div>
          
          <div class="user-info">
            <div class="info-item">
              <span class="label">👤 Username:</span>
              <span class="value">{{ user.username }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">📧 Email:</span>
              <span class="value">{{ user.email }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">📱 Phone:</span>
              <span class="value">{{ user.phone }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">🌐 Website:</span>
              <span class="value">{{ user.website }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">🏢 Company:</span>
              <span class="value">{{ user.company.name }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">📍 City:</span>
              <span class="value">{{ user.address.city }}</span>
            </div>
          </div>
          
          <div class="click-hint">👆 Click để xem chi tiết</div>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container {
      padding: 40px 20px;
      max-width: 1400px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    
    h1 {
      text-align: center;
      color: white;
      font-size: 2.5rem;
      margin-bottom: 40px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
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
    
    .user-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .user-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.3);
    }
    
    .user-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 auto 16px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .user-header h2 {
      color: #333;
      margin: 0;
      font-size: 1.5rem;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .label {
      font-size: 0.85rem;
      color: #666;
      font-weight: 600;
    }
    
    .value {
      color: #333;
      font-size: 0.95rem;
      word-break: break-word;
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
    
    .click-hint {
      text-align: center;
      color: #667eea;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 2px solid #f0f0f0;
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }
    
    .user-card:hover .click-hint {
      opacity: 1;
    }
    
    @media (max-width: 768px) {
      .user-grid {
        grid-template-columns: 1fr;
      }
      
      h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class UserComponent {
  users$;
  users;
  userCount;

  constructor(private userService: UserService) {
    // Initialize after userService is injected
    this.users$ = this.userService.getUsers();
    this.users = toSignal(this.users$, { initialValue: null });
    this.userCount = computed(() => this.users()?.length ?? 0);
  }
}
