# 🌐 AUTH API CONNECTION - GIẢI THÍCH CHI TIẾT

## 📍 Tổng Quan Kết Nối API

Auth module kết nối với **DummyJSON API** để xử lý authentication.

### 🔗 API Base URL
```typescript
// File: auth.service.ts (Dòng 24)
private readonly API_URL = 'https://dummyjson.com/auth';
```

---

## 🔑 1. LOGIN API

### 📍 Vị Trí Code
**File:** `src/app/auth/services/auth.service.ts` (Dòng 35-53)

### 🌐 API Endpoint
```
POST https://dummyjson.com/auth/login
```

### 📤 Request
```typescript
// Dòng 38
this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
```

**Request Body:**
```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 30
}
```

**TypeScript Interface:**
```typescript
interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}
```

### 📥 Response
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔄 Flow Chi Tiết

```typescript
// BƯỚC 1: Set loading state (Dòng 36)
this.authStore.setLoading(true);

// BƯỚC 2: Gọi API (Dòng 38)
return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
  .pipe(
    // BƯỚC 3: Xử lý response thành công (Dòng 40-44)
    tap(response => {
      // Lưu user + tokens vào store
      this.authStore.setUser(response);
      console.log('✅ Login successful:', response);
    }),
    
    // BƯỚC 4: Xử lý lỗi (Dòng 45-51)
    catchError(error => {
      const errorMessage = error.error?.message || 'Đăng nhập thất bại';
      this.authStore.setError(errorMessage);
      console.error('❌ Login failed:', error);
      return throwError(() => error);
    })
  );
```

### 🎯 Cách Sử Dụng

**Trong Component:**
```typescript
// login.component.ts
onLogin() {
  const credentials = {
    username: this.username(),
    password: this.password(),
    expiresInMins: 30
  };

  // Gọi service
  this.authService.login(credentials).subscribe({
    next: () => {
      // ✅ Login thành công
      this.router.navigate(['/auth/dashboard']);
    },
    error: (err) => {
      // ❌ Login thất bại
      console.error('Login error:', err);
    }
  });
}
```

### 📊 Sequence Diagram

```
User                Component           AuthService         API              AuthStore
 |                      |                    |                |                  |
 |--[Enter credentials]->|                   |                |                  |
 |                      |--[login(creds)]-->|                |                  |
 |                      |                    |--[setLoading(true)]------------->|
 |                      |                    |                |                  |
 |                      |                    |--[POST /login]->|                 |
 |                      |                    |                |                  |
 |                      |                    |<--[response]---|                  |
 |                      |                    |                |                  |
 |                      |                    |--[setUser(response)]------------>|
 |                      |                    |                |                  |
 |                      |<--[Observable]-----|                |                  |
 |                      |                    |                |                  |
 |<--[Navigate to dashboard]                 |                |                  |
```

---

## 🔄 2. REFRESH TOKEN API

### 📍 Vị Trí Code
**File:** `src/app/auth/services/auth.service.ts` (Dòng 63-91)

### 🌐 API Endpoint
```
POST https://dummyjson.com/auth/refresh
```

### 📤 Request
```typescript
// Dòng 77
this.http.post<RefreshTokenResponse>(`${this.API_URL}/refresh`, request)
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresInMins": 30
}
```

### 📥 Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // Token mới
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // Refresh token mới
}
```

### 🔄 Flow Chi Tiết

```typescript
// BƯỚC 1: Lấy refreshToken từ store (Dòng 64)
const currentRefreshToken = this.authStore.refreshToken();

// BƯỚC 2: Kiểm tra có token không (Dòng 66-70)
if (!currentRefreshToken) {
  console.error('❌ No refresh token available');
  this.authStore.logout();
  return throwError(() => new Error('No refresh token'));
}

// BƯỚC 3: Tạo request body (Dòng 72-75)
const request: RefreshTokenRequest = {
  refreshToken: currentRefreshToken,
  expiresInMins: 30
};

// BƯỚC 4: Gọi API (Dòng 77)
return this.http.post<RefreshTokenResponse>(`${this.API_URL}/refresh`, request)
  .pipe(
    // BƯỚC 5: Cập nhật tokens mới (Dòng 79-83)
    tap(response => {
      this.authStore.updateTokens(response.accessToken, response.refreshToken);
      console.log('✅ Token refreshed successfully');
    }),
    
    // BƯỚC 6: Xử lý lỗi (Dòng 84-90)
    catchError(error => {
      console.error('❌ Token refresh failed:', error);
      this.authStore.logout();  // Logout nếu refresh fail
      return throwError(() => error);
    })
  );
```

### 🎯 Khi Nào Được Gọi?

**1. Tự động bởi Interceptor (khi API trả về 401):**
```typescript
// auth.interceptor.ts
if (error.status === 401) {
  return authService.refreshToken().pipe(
    switchMap(() => {
      // Retry request với token mới
      return next(retryReq);
    })
  );
}
```

**2. Manual bởi User (trong Profile page):**
```typescript
// profile.component.ts
onRefreshToken() {
  this.authService.refreshToken().subscribe({
    next: () => alert('✅ Token refreshed!'),
    error: () => alert('❌ Refresh failed!')
  });
}
```

---

## 🔍 3. GET CURRENT USER API

### 📍 Vị Trí Code
**File:** `src/app/auth/services/auth.service.ts` (Dòng 107-118)

### 🌐 API Endpoint
```
GET https://dummyjson.com/auth/me
```

### 📤 Request
```typescript
// Dòng 108
this.http.get(`${this.API_URL}/me`)
```

**Headers (tự động bởi Interceptor):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 📥 Response
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128"
}
```

### 🎯 Mục Đích
- ✅ Verify token còn hợp lệ
- ✅ Test API call với token
- ✅ Demo cho user xem interceptor hoạt động

---

## 🛡️ 4. HTTP INTERCEPTOR - TỰ ĐỘNG ATTACH TOKEN

### 📍 Vị Trí Code
**File:** `src/app/auth/interceptors/auth.interceptor.ts`

### 🔄 Cách Hoạt Động

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  
  // 1️⃣ Lấy token từ store
  const accessToken = authStore.accessToken();
  
  // 2️⃣ Clone request và thêm Authorization header
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`  // ← Tự động thêm
      }
    });
  }
  
  // 3️⃣ Gửi request
  return next(authReq).pipe(
    catchError(error => {
      // 4️⃣ Nếu 401 → Refresh token → Retry
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => next(retryReq))
        );
      }
      return throwError(() => error);
    })
  );
};
```

### 📊 Flow Diagram

```
Component gọi API
      ↓
Interceptor bắt request
      ↓
Lấy accessToken từ AuthStore
      ↓
Clone request + thêm header: Authorization: Bearer {token}
      ↓
Gửi request đến server
      ↓
┌─────────────────────────────┐
│ Response 200 OK             │ → Trả về data
│ Response 401 Unauthorized   │ → Refresh token → Retry
└─────────────────────────────┘
```

---

## 📝 5. ĐĂNG KÝ INTERCEPTOR

### 📍 Vị Trí Code
**File:** `src/app/app.config.ts`

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ✅ Đăng ký HTTP Client với Auth Interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])  // ← Interceptor được đăng ký ở đây
    )
  ]
};
```

**Kết quả:**
- ✅ MỌI HTTP request đều đi qua interceptor
- ✅ Token tự động được thêm vào header
- ✅ 401 errors tự động được xử lý

---

## 🔗 6. TOÀN BỘ FLOW KẾT NỐI API

### Login Flow (End-to-End)

```
1. User nhập username/password
   ↓
2. Component gọi authService.login(credentials)
   ↓
3. AuthService set loading = true
   ↓
4. HttpClient POST https://dummyjson.com/auth/login
   ↓
5. Interceptor KHÔNG thêm token (chưa có token)
   ↓
6. Request gửi đến DummyJSON API
   ↓
7. API verify credentials
   ↓
8. API trả về: { user, accessToken, refreshToken }
   ↓
9. AuthService nhận response
   ↓
10. AuthService gọi authStore.setUser(response)
    ↓
11. AuthStore lưu user + tokens vào state
    ↓
12. AuthStore lưu vào localStorage
    ↓
13. Component nhận success
    ↓
14. Component navigate đến /auth/dashboard
```

### API Call với Token (End-to-End)

```
1. User click "Test API Call" trong Dashboard
   ↓
2. Component gọi authService.getCurrentUser()
   ↓
3. HttpClient GET https://dummyjson.com/auth/me
   ↓
4. Interceptor bắt request
   ↓
5. Interceptor lấy accessToken từ AuthStore
   ↓
6. Interceptor clone request + thêm header:
   Authorization: Bearer eyJhbGc...
   ↓
7. Request gửi đến API với token
   ↓
8. API verify token
   ↓
┌──────────────────────────────────────┐
│ Token hợp lệ                         │
│  ↓                                   │
│ API trả về user data                 │
│  ↓                                   │
│ Component hiển thị data              │
└──────────────────────────────────────┘
        hoặc
┌──────────────────────────────────────┐
│ Token hết hạn (401)                  │
│  ↓                                   │
│ Interceptor bắt lỗi 401              │
│  ↓                                   │
│ Interceptor gọi refreshToken()       │
│  ↓                                   │
│ POST /auth/refresh với refreshToken  │
│  ↓                                   │
│ Nhận tokens mới                      │
│  ↓                                   │
│ AuthStore cập nhật tokens            │
│  ↓                                   │
│ Interceptor retry request ban đầu    │
│  ↓                                   │
│ Request thành công với token mới     │
│  ↓                                   │
│ Component hiển thị data              │
└──────────────────────────────────────┘
```

---

## 🧪 7. TEST KẾT NỐI API

### Test 1: Login API
```typescript
// Mở DevTools → Network tab
// Login với: emilys / emilyspass

// ✅ Xem request:
POST https://dummyjson.com/auth/login
Request Body: { username: "emilys", password: "emilyspass" }

// ✅ Xem response:
Status: 200 OK
Response: { id: 1, username: "emilys", accessToken: "...", ... }
```

### Test 2: API với Token
```typescript
// Click "Test API Call" trong Dashboard
// Mở DevTools → Network tab

// ✅ Xem request:
GET https://dummyjson.com/auth/me
Headers: Authorization: Bearer eyJhbGc...

// ✅ Xem response:
Status: 200 OK
Response: { id: 1, username: "emilys", ... }
```

### Test 3: Refresh Token
```typescript
// Vào Profile → Click "Refresh Token Ngay"
// Mở DevTools → Network tab

// ✅ Xem request:
POST https://dummyjson.com/auth/refresh
Request Body: { refreshToken: "...", expiresInMins: 30 }

// ✅ Xem response:
Status: 200 OK
Response: { accessToken: "...", refreshToken: "..." }
```

---

## 📊 8. DEPENDENCIES GIỮA CÁC PHẦN

```
┌─────────────────────────────────────────────────────────┐
│                     COMPONENT                            │
│  (login.component.ts, dashboard.component.ts)           │
└─────────────────────┬───────────────────────────────────┘
                      │ Gọi methods
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   AUTH SERVICE                           │
│  (auth.service.ts)                                      │
│  - login()                                              │
│  - refreshToken()                                       │
│  - getCurrentUser()                                     │
└─────────┬───────────────────────────┬───────────────────┘
          │                           │
          │ Sử dụng                   │ Cập nhật state
          ↓                           ↓
┌──────────────────────┐    ┌─────────────────────────────┐
│   HTTP CLIENT        │    │      AUTH STORE             │
│  (Angular built-in)  │    │   (auth.store.ts)           │
└──────────┬───────────┘    │  - user                     │
           │                │  - accessToken              │
           │ Đi qua         │  - refreshToken             │
           ↓                │  - isAuthenticated          │
┌──────────────────────┐    └─────────────────────────────┘
│   INTERCEPTOR        │              ↑
│ (auth.interceptor.ts)│              │
│  - Attach token      │              │ Lưu/Load
│  - Handle 401        │              ↓
└──────────┬───────────┘    ┌─────────────────────────────┐
           │                │      LOCAL STORAGE           │
           │ Gửi request    │   key: 'auth_state'         │
           ↓                └─────────────────────────────┘
┌──────────────────────┐
│   DUMMYJSON API      │
│  /auth/login         │
│  /auth/refresh       │
│  /auth/me            │
└──────────────────────┘
```

---

## 🎯 9. TÓM TẮT

### API Endpoints
| Endpoint | Method | Mục đích |
|----------|--------|----------|
| `/auth/login` | POST | Đăng nhập |
| `/auth/refresh` | POST | Làm mới token |
| `/auth/me` | GET | Lấy thông tin user |

### Files Liên Quan
| File | Vai trò |
|------|---------|
| `auth.service.ts` | Gọi API |
| `auth.interceptor.ts` | Attach token tự động |
| `auth.store.ts` | Lưu tokens |
| `app.config.ts` | Đăng ký interceptor |

### Flow Chính
1. **Login** → Lưu tokens → localStorage
2. **API Call** → Interceptor attach token
3. **401 Error** → Refresh token → Retry
4. **Logout** → Clear tokens → localStorage

---

**Đọc file này để hiểu rõ cách Auth module kết nối với API! 🚀**
