# 🔐 HƯỚNG DẪN AUTHENTICATION CHI TIẾT

## 📚 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
3. [Flow Hoạt Động](#flow-hoạt-động)
4. [Chi Tiết Từng Phần](#chi-tiết-từng-phần)
5. [Cách Sử Dụng](#cách-sử-dụng)
6. [Test Cases](#test-cases)
7. [Lưu Ý Quan Trọng](#lưu-ý-quan-trọng)

---

## 🎯 Tổng Quan

Đây là một hệ thống **Authentication hoàn chỉnh** sử dụng:
- **DummyJSON API** cho login/refresh
- **Angular Signals** cho state management
- **HTTP Interceptor** để tự động attach token
- **Route Guards** để bảo vệ routes
- **LocalStorage** để persist auth state

### Tính Năng Chính
✅ Login với username/password  
✅ Tự động lưu tokens (access + refresh)  
✅ Tự động attach token vào mọi HTTP request  
✅ Tự động refresh token khi hết hạn (401)  
✅ Logout và clear state  
✅ Route guards bảo vệ trang  
✅ Persist state trong localStorage  

---

## 📁 Cấu Trúc Dự Án

```
src/app/auth/
├── models/
│   └── auth.model.ts           # Interfaces cho User, LoginRequest, etc.
├── store/
│   └── auth.store.ts           # State management với Signals
├── services/
│   └── auth.service.ts         # API calls (login, refresh, logout)
├── interceptors/
│   └── auth.interceptor.ts     # HTTP interceptor
├── guards/
│   └── auth.guard.ts           # Route guards (authGuard, guestGuard)
└── components/
    ├── login/                  # Trang đăng nhập
    ├── dashboard/              # Trang chủ sau login
    └── profile/                # Trang profile chi tiết
```

---

## 🔄 Flow Hoạt Động

### 1️⃣ LOGIN FLOW

```
User nhập username/password
        ↓
LoginComponent gọi authService.login()
        ↓
AuthService gọi API: POST /auth/login
        ↓
API trả về: { user, accessToken, refreshToken }
        ↓
AuthStore.setUser() lưu vào state
        ↓
State được lưu vào localStorage
        ↓
Redirect đến /auth/dashboard
```

**Code minh họa:**
```typescript
// login.component.ts
onLogin() {
  const credentials = {
    username: this.username(),
    password: this.password()
  };

  this.authService.login(credentials).subscribe({
    next: () => {
      // ✅ Login thành công
      this.router.navigate(['/auth/dashboard']);
    }
  });
}
```

---

### 2️⃣ HTTP INTERCEPTOR FLOW

```
Component gọi HTTP request
        ↓
Interceptor bắt request
        ↓
Lấy accessToken từ AuthStore
        ↓
Clone request + thêm header: Authorization: Bearer {token}
        ↓
Gửi request đến server
        ↓
┌─────────────────────────────────┐
│ Nếu response OK (200)           │ → Trả về data
│ Nếu response 401 (Unauthorized) │ → Chuyển sang REFRESH FLOW
└─────────────────────────────────┘
```

**Code minh họa:**
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const accessToken = authStore.accessToken();

  // Thêm token vào header
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Xử lý refresh token...
      }
      return throwError(() => error);
    })
  );
};
```

---

### 3️⃣ REFRESH TOKEN FLOW

```
API trả về 401 (Token hết hạn)
        ↓
Interceptor bắt lỗi 401
        ↓
Gọi authService.refreshToken()
        ↓
API: POST /auth/refresh với refreshToken
        ↓
┌─────────────────────────────────────┐
│ Refresh thành công                  │
│  ↓                                   │
│ Lưu tokens mới vào AuthStore        │
│  ↓                                   │
│ Retry request ban đầu với token mới │
│  ↓                                   │
│ Trả về data cho component            │
└─────────────────────────────────────┘
        hoặc
┌─────────────────────────────────────┐
│ Refresh thất bại                     │
│  ↓                                   │
│ Logout user                          │
│  ↓                                   │
│ Redirect về /auth/login              │
└─────────────────────────────────────┘
```

**Code minh họa:**
```typescript
// auth.interceptor.ts
catchError(error => {
  if (error.status === 401 && !req.url.includes('/auth/login')) {
    // Thử refresh token
    return authService.refreshToken().pipe(
      switchMap(() => {
        // ✅ Refresh thành công - Retry request
        const newToken = authStore.accessToken();
        const retryReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next(retryReq);
      }),
      catchError(refreshError => {
        // ❌ Refresh thất bại - Logout
        authStore.logout();
        return throwError(() => refreshError);
      })
    );
  }
  return throwError(() => error);
})
```

---

### 4️⃣ ROUTE GUARD FLOW

#### Auth Guard (Bảo vệ trang yêu cầu login)

```
User truy cập /auth/dashboard
        ↓
authGuard được kích hoạt
        ↓
Kiểm tra authStore.isAuthenticated()
        ↓
┌─────────────────────────────┐
│ isAuthenticated = true      │ → Cho phép truy cập
│ isAuthenticated = false     │ → Redirect về /auth/login
└─────────────────────────────┘
```

**Code minh họa:**
```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true; // ✅ Cho phép truy cập
  } else {
    // ❌ Redirect về login
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
};
```

#### Guest Guard (Ngược lại - cho trang login)

```
User đã login truy cập /auth/login
        ↓
guestGuard được kích hoạt
        ↓
Kiểm tra authStore.isAuthenticated()
        ↓
┌─────────────────────────────┐
│ isAuthenticated = false     │ → Cho phép truy cập login
│ isAuthenticated = true      │ → Redirect về /auth/dashboard
└─────────────────────────────┘
```

---

### 5️⃣ LOGOUT FLOW

```
User click nút Logout
        ↓
authService.logout()
        ↓
authStore.logout()
        ↓
Clear state (user, tokens = null)
        ↓
Xóa localStorage
        ↓
Redirect về /auth/login
```

---

## 🧩 Chi Tiết Từng Phần

### 1. Auth Models (`auth.model.ts`)

Định nghĩa các **interface** cho TypeScript:

```typescript
// User từ API
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

// Login request
export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

// Login response
export interface LoginResponse {
  id: number;
  username: string;
  // ... user fields
  accessToken: string;
  refreshToken: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Tại sao cần?**
- TypeScript cần biết cấu trúc data
- Giúp IDE autocomplete
- Tránh lỗi runtime

---

### 2. Auth Store (`auth.store.ts`)

**State management** với Angular Signals:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthStore {
  // 📊 PRIVATE STATE
  private state = signal<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // 🔍 PUBLIC SELECTORS (read-only)
  readonly user = computed(() => this.state().user);
  readonly accessToken = computed(() => this.state().accessToken);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  // ...

  // ⚙️ ACTIONS (methods để thay đổi state)
  setUser(loginResponse: LoginResponse) {
    this.state.update(state => ({
      ...state,
      user: { /* extract user */ },
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
      isAuthenticated: true
    }));
    this.saveToLocalStorage();
  }

  logout() {
    this.state.set({ /* reset state */ });
    this.clearLocalStorage();
    this.router.navigate(['/auth/login']);
  }
}
```

**Tại sao dùng Signals?**
- ✅ Reactive tự động (component tự update khi state thay đổi)
- ✅ Performance tốt hơn (chỉ re-render khi cần)
- ✅ Code đơn giản, dễ hiểu

**LocalStorage:**
- Lưu state khi login thành công
- Load lại khi refresh trang
- Xóa khi logout

---

### 3. Auth Service (`auth.service.ts`)

**Xử lý API calls:**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  private readonly API_URL = 'https://dummyjson.com/auth';

  // 🔑 LOGIN
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.authStore.setLoading(true);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          // ✅ Lưu vào store
          this.authStore.setUser(response);
        }),
        catchError(error => {
          // ❌ Set error
          this.authStore.setError(error.error?.message || 'Login failed');
          return throwError(() => error);
        })
      );
  }

  // 🔄 REFRESH TOKEN
  refreshToken(): Observable<RefreshTokenResponse> {
    const currentRefreshToken = this.authStore.refreshToken();
    
    return this.http.post<RefreshTokenResponse>(
      `${this.API_URL}/refresh`,
      { refreshToken: currentRefreshToken }
    ).pipe(
      tap(response => {
        // ✅ Cập nhật tokens mới
        this.authStore.updateTokens(
          response.accessToken,
          response.refreshToken
        );
      }),
      catchError(error => {
        // ❌ Refresh thất bại → Logout
        this.authStore.logout();
        return throwError(() => error);
      })
    );
  }

  // 🚪 LOGOUT
  logout() {
    this.authStore.logout();
  }
}
```

**Tại sao tách Service?**
- Tách logic API ra khỏi component
- Dễ test
- Dễ tái sử dụng

---

### 4. HTTP Interceptor (`auth.interceptor.ts`)

**Tự động xử lý token:**

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);

  // 1️⃣ Lấy token từ store
  const accessToken = authStore.accessToken();

  // 2️⃣ Clone request + thêm Authorization header
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // 3️⃣ Gửi request
  return next(authReq).pipe(
    catchError(error => {
      // 4️⃣ Xử lý 401 - Token hết hạn
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry với token mới
            const newToken = authStore.accessToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(retryReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
```

**Tại sao cần Interceptor?**
- ✅ Tự động attach token → Không cần thêm header thủ công
- ✅ Tự động refresh khi 401 → User không bị logout đột ngột
- ✅ Code component đơn giản hơn

---

### 5. Route Guards (`auth.guard.ts`)

**Bảo vệ routes:**

```typescript
// Auth Guard - Yêu cầu đăng nhập
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true; // ✅ Cho phép
  } else {
    // ❌ Redirect về login
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url } // Lưu URL để redirect sau login
    });
  }
};

// Guest Guard - Chỉ cho phép khi chưa login
export const guestGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true; // ✅ Cho phép
  } else {
    // ❌ Đã login rồi → Redirect về dashboard
    return router.createUrlTree(['/auth/dashboard']);
  }
};
```

**Sử dụng trong routes:**
```typescript
{
  path: 'auth/dashboard',
  component: DashboardComponent,
  canActivate: [authGuard] // ← Bảo vệ route này
}
```

---

## 🚀 Cách Sử Dụng

### Bước 1: Chạy ứng dụng

```bash
npm start
# hoặc
ng serve
```

### Bước 2: Truy cập trang login

Mở trình duyệt: `http://localhost:4200`

→ Tự động redirect về `/auth/login`

### Bước 3: Đăng nhập

Sử dụng một trong các tài khoản test:

| Username | Password |
|----------|----------|
| emilys | emilyspass |
| michaelw | michaelwpass |
| sophiab | sophiabpass |

### Bước 4: Sau khi login

✅ Redirect về `/auth/dashboard`  
✅ Xem thông tin user  
✅ Xem tokens  
✅ Test API call  
✅ Xem profile  

### Bước 5: Test các tính năng

1. **Test Route Guard:**
   - Logout
   - Thử truy cập `/auth/dashboard` → Bị redirect về login
   - Login lại → Vào được dashboard

2. **Test Token Refresh:**
   - Vào `/auth/profile`
   - Click "Refresh Token Ngay"
   - Check console → Token mới được tạo

3. **Test Interceptor:**
   - Vào dashboard
   - Click "Test API Call"
   - Mở DevTools → Network → Xem request có header `Authorization: Bearer ...`

4. **Test LocalStorage:**
   - Login
   - Refresh trang (F5)
   - Vẫn đăng nhập (không bị logout)

---

## 🧪 Test Cases

### Test 1: Login thành công
```
✅ Input: username = "emilys", password = "emilyspass"
✅ Expected: Redirect về /auth/dashboard
✅ Check: localStorage có "auth_state"
```

### Test 2: Login thất bại
```
❌ Input: username = "wrong", password = "wrong"
❌ Expected: Hiện error message
❌ Check: Không redirect, vẫn ở trang login
```

### Test 3: Route Guard - Chưa login
```
🔒 Action: Truy cập /auth/dashboard khi chưa login
🔒 Expected: Redirect về /auth/login
```

### Test 4: Route Guard - Đã login
```
✅ Action: Truy cập /auth/login khi đã login
✅ Expected: Redirect về /auth/dashboard
```

### Test 5: Logout
```
🚪 Action: Click logout
🚪 Expected: 
   - State reset
   - localStorage cleared
   - Redirect về /auth/login
```

### Test 6: Token Refresh
```
🔄 Action: Click "Refresh Token Ngay"
🔄 Expected:
   - API call thành công
   - Tokens mới được lưu
   - Alert "Token đã được refresh"
```

### Test 7: Interceptor attach token
```
🔐 Action: Gọi bất kỳ API nào
🔐 Expected: Request có header Authorization: Bearer {token}
```

### Test 8: LocalStorage persistence
```
💾 Action: Login → Refresh trang (F5)
💾 Expected: Vẫn đăng nhập, không bị logout
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. DummyJSON API Limitations

- **Token expiry:** Tokens từ DummyJSON không thực sự hết hạn
- **Refresh endpoint:** Có thể không hoạt động như production API
- **Chỉ dùng để học:** Không dùng cho production

### 2. Security Best Practices

**❌ KHÔNG NÊN (trong production):**
- Lưu tokens trong localStorage (dễ bị XSS attack)
- Hardcode credentials trong code
- Log tokens ra console

**✅ NÊN (trong production):**
- Dùng httpOnly cookies cho tokens
- Implement CSRF protection
- Dùng HTTPS
- Implement rate limiting
- Hash passwords

### 3. Angular Signals

- Signals là tính năng mới (Angular 16+)
- Đơn giản hơn RxJS cho state management
- Nhưng vẫn cần RxJS cho async operations (HTTP)

### 4. Interceptor Order

- Interceptors chạy theo thứ tự đăng ký trong `app.config.ts`
- Nếu có nhiều interceptors, cần chú ý thứ tự

### 5. Error Handling

- Luôn handle errors trong subscribe
- Hiển thị error messages cho user
- Log errors để debug

---

## 📖 Kiến Thức Cần Nắm

### 1. Angular Signals
```typescript
// Signal - Reactive value
const count = signal(0);

// Computed - Derived value
const double = computed(() => count() * 2);

// Update
count.set(5);
count.update(n => n + 1);
```

### 2. RxJS Operators
```typescript
// tap - Side effects
.pipe(tap(data => console.log(data)))

// catchError - Error handling
.pipe(catchError(err => throwError(() => err)))

// switchMap - Switch to new observable
.pipe(switchMap(() => otherObservable))
```

### 3. HTTP Client
```typescript
// GET
this.http.get<User>('/api/user')

// POST
this.http.post<Response>('/api/login', { username, password })

// Headers
this.http.get('/api/data', {
  headers: { Authorization: 'Bearer token' }
})
```

### 4. Router
```typescript
// Navigate
this.router.navigate(['/path']);

// Navigate with query params
this.router.navigate(['/path'], {
  queryParams: { id: 123 }
});

// Create URL tree (for guards)
return this.router.createUrlTree(['/login']);
```

---

## 🎓 Bài Tập Thực Hành

### Bài 1: Thêm "Remember Me"
- Thêm checkbox "Ghi nhớ đăng nhập"
- Nếu check: lưu vào localStorage
- Nếu không: dùng sessionStorage

### Bài 2: Thêm Loading Spinner
- Hiển thị spinner khi đang login
- Disable form khi đang loading

### Bài 3: Thêm Error Messages
- Hiển thị lỗi cụ thể từ API
- Tự động ẩn sau 5 giây

### Bài 4: Thêm Token Expiry Timer
- Hiển thị thời gian còn lại của token
- Tự động refresh trước khi hết hạn

### Bài 5: Thêm User Avatar Upload
- Cho phép user upload avatar
- Lưu vào state

---

## 🔗 Tài Liệu Tham Khảo

- [DummyJSON API Docs](https://dummyjson.com/docs/auth)
- [Angular Signals](https://angular.io/guide/signals)
- [Angular HTTP Client](https://angular.io/guide/http)
- [Angular Router Guards](https://angular.io/guide/router#preventing-unauthorized-access)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

## 💡 Tips & Tricks

### 1. Debug với Console
```typescript
// Log mọi thay đổi của signal
effect(() => {
  console.log('User changed:', this.authStore.user());
});
```

### 2. DevTools
- Mở Network tab để xem HTTP requests
- Mở Application → Local Storage để xem auth_state
- Mở Console để xem logs

### 3. Keyboard Shortcuts
- `Ctrl + Shift + I`: Mở DevTools
- `F5`: Refresh trang
- `Ctrl + Shift + R`: Hard refresh (clear cache)

---

## ❓ FAQ

**Q: Tại sao dùng Signals thay vì RxJS BehaviorSubject?**  
A: Signals đơn giản hơn, performance tốt hơn, và là tương lai của Angular.

**Q: Interceptor có chạy cho mọi HTTP request không?**  
A: Có, kể cả requests đến external APIs.

**Q: Làm sao để skip interceptor cho một request?**  
A: Thêm context vào request:
```typescript
this.http.get('/api/data', {
  context: new HttpContext().set(SKIP_AUTH, true)
});
```

**Q: Token refresh có tự động không?**  
A: Có, khi API trả về 401, interceptor tự động refresh.

**Q: LocalStorage có an toàn không?**  
A: Không hoàn toàn. Trong production nên dùng httpOnly cookies.

---

## 🎉 Kết Luận

Bạn đã học được:
✅ Cách xây dựng hệ thống Authentication hoàn chỉnh  
✅ Sử dụng Angular Signals cho state management  
✅ Implement HTTP Interceptor  
✅ Sử dụng Route Guards  
✅ Xử lý token refresh tự động  
✅ Persist state với localStorage  

**Next Steps:**
1. Thực hành với các bài tập
2. Thêm tính năng mới
3. Tích hợp vào dự án thực tế
4. Học về advanced security practices

**Happy Coding! 🚀**
