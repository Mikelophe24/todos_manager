# 🔐 AUTH QUICK REFERENCE

## 🚀 Quick Start

### 1. Chạy App
```bash
npm start
```

### 2. Truy cập
```
http://localhost:4200
→ Auto redirect to /auth/login
```

### 3. Test Accounts
| Username | Password |
|----------|----------|
| emilys | emilyspass |
| michaelw | michaelwpass |
| sophiab | sophiabpass |

---

## 📁 Cấu Trúc Files

```
auth/
├── models/auth.model.ts          # Interfaces
├── store/auth.store.ts            # State với Signals
├── services/auth.service.ts       # API calls
├── interceptors/auth.interceptor.ts  # Auto attach token
├── guards/auth.guard.ts           # Route protection
└── components/
    ├── login/                     # Trang login
    ├── dashboard/                 # Trang chủ
    └── profile/                   # Profile chi tiết
```

---

## 🔑 Core Concepts

### 1. Auth Store (State Management)
```typescript
// Đọc state
const user = authStore.user();
const isAuth = authStore.isAuthenticated();

// Thay đổi state
authStore.setUser(loginResponse);
authStore.logout();
```

### 2. Auth Service (API Calls)
```typescript
// Login
authService.login({ username, password }).subscribe();

// Refresh token
authService.refreshToken().subscribe();

// Logout
authService.logout();
```

### 3. HTTP Interceptor
```typescript
// Tự động thêm header cho MỌI request:
Authorization: Bearer {accessToken}

// Tự động xử lý 401:
401 → Refresh token → Retry request
```

### 4. Route Guards
```typescript
// authGuard: Yêu cầu login
{
  path: 'dashboard',
  canActivate: [authGuard]
}

// guestGuard: Chỉ cho phép khi chưa login
{
  path: 'login',
  canActivate: [guestGuard]
}
```

---

## 🔄 Flow Diagrams

### Login Flow
```
User input → authService.login() → API
→ authStore.setUser() → localStorage
→ Navigate to /dashboard
```

### Interceptor Flow
```
HTTP Request → Interceptor
→ Add token to header → Send request
→ If 401 → Refresh token → Retry
→ If refresh fails → Logout
```

### Guard Flow
```
Navigate to protected route → authGuard
→ Check isAuthenticated
→ If true: Allow
→ If false: Redirect to /login
```

---

## 📝 Common Tasks

### Lấy thông tin user hiện tại
```typescript
export class MyComponent {
  authStore = inject(AuthStore);
  
  user = this.authStore.user();
  fullName = this.authStore.fullName();
}
```

### Kiểm tra đã login chưa
```typescript
@if (authStore.isAuthenticated()) {
  <p>Đã đăng nhập</p>
} @else {
  <p>Chưa đăng nhập</p>
}
```

### Logout
```typescript
onLogout() {
  this.authService.logout();
  // Auto redirect to /auth/login
}
```

### Gọi API với token
```typescript
// Token tự động được thêm vào header
this.http.get('/api/protected-data').subscribe();
```

---

## 🧪 Test Checklist

- [ ] Login với credentials đúng → Vào dashboard
- [ ] Login với credentials sai → Hiện error
- [ ] Truy cập /auth/dashboard khi chưa login → Redirect login
- [ ] Truy cập /auth/login khi đã login → Redirect dashboard
- [ ] Logout → Clear state, redirect login
- [ ] Refresh trang (F5) → Vẫn đăng nhập
- [ ] Click "Test API Call" → Request có Authorization header
- [ ] Click "Refresh Token" → Tokens mới được tạo

---

## 🐛 Debug Tips

### Check localStorage
```javascript
// Console
localStorage.getItem('auth_state')
```

### Check state
```typescript
// Component
console.log('User:', this.authStore.user());
console.log('Token:', this.authStore.accessToken());
console.log('IsAuth:', this.authStore.isAuthenticated());
```

### Check HTTP headers
```
DevTools → Network → Click request → Headers
→ Xem "Authorization: Bearer ..."
```

---

## ⚠️ Common Issues

### Issue: Bị logout sau khi refresh trang
**Fix:** Check localStorage có data không

### Issue: API call không có token
**Fix:** Check interceptor đã được đăng ký trong app.config.ts

### Issue: Guard không hoạt động
**Fix:** Check routes có canActivate: [authGuard]

### Issue: Refresh token không tự động
**Fix:** Check interceptor có bắt lỗi 401 không

---

## 📚 Files Quan Trọng

| File | Mục đích |
|------|----------|
| `auth.store.ts` | Quản lý state |
| `auth.service.ts` | API calls |
| `auth.interceptor.ts` | Auto attach token |
| `auth.guard.ts` | Bảo vệ routes |
| `app.config.ts` | Đăng ký interceptor |
| `app.routes.ts` | Định nghĩa routes + guards |

---

## 🎯 Key Points

1. **Store** = Single source of truth cho auth state
2. **Service** = Xử lý API calls
3. **Interceptor** = Tự động xử lý token
4. **Guards** = Bảo vệ routes
5. **LocalStorage** = Persist state

---

## 📖 Đọc Thêm

- `AUTH_GUIDE.md` - Hướng dẫn chi tiết
- [DummyJSON Docs](https://dummyjson.com/docs/auth)
- [Angular Signals](https://angular.io/guide/signals)

---

**Happy Coding! 🚀**
