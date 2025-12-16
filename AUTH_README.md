# 🔐 AUTHENTICATION PRACTICE - TỔNG HỢP

## 📋 Tổng Quan Dự Án

Đây là module **Authentication thực chiến** với DummyJSON API, bao gồm:

✅ **Store** - Quản lý state với Angular Signals  
✅ **Effects** - Login/Logout/Refresh  
✅ **HTTP Interceptor** - Tự động attach token + handle 401  
✅ **Route Guards** - Bảo vệ routes theo auth state  
✅ **LocalStorage** - Persist auth state  

---

## 🎯 Mục Tiêu Học Tập

Sau khi hoàn thành module này, bạn sẽ:

1. ✅ Hiểu cách xây dựng hệ thống Authentication hoàn chỉnh
2. ✅ Thành thạo Angular Signals cho state management
3. ✅ Biết cách implement HTTP Interceptor
4. ✅ Sử dụng Route Guards để bảo vệ routes
5. ✅ Xử lý token refresh tự động
6. ✅ Persist state với localStorage

---

## 🚀 Bắt Đầu Nhanh

### 1. Chạy ứng dụng
```bash
npm start
# hoặc
ng serve
```

### 2. Mở trình duyệt
```
http://localhost:4200
```

### 3. Đăng nhập
Sử dụng một trong các tài khoản:
- **emilys** / emilyspass
- **michaelw** / michaelwpass
- **sophiab** / sophiabpass

---

## 📁 Cấu Trúc Dự Án

```
src/app/auth/
├── models/
│   └── auth.model.ts              # ✅ Interfaces (User, LoginRequest, AuthState)
│
├── store/
│   └── auth.store.ts              # ✅ State management với Signals
│
├── services/
│   └── auth.service.ts            # ✅ API calls (login, refresh, logout)
│
├── interceptors/
│   └── auth.interceptor.ts        # ✅ Auto attach token + handle 401
│
├── guards/
│   └── auth.guard.ts              # ✅ Route protection (authGuard, guestGuard)
│
└── components/
    ├── login/                     # ✅ Trang đăng nhập
    │   ├── login.component.ts
    │   ├── login.component.html
    │   └── login.component.scss
    │
    ├── dashboard/                 # ✅ Trang chủ sau login
    │   ├── dashboard.component.ts
    │   ├── dashboard.component.html
    │   └── dashboard.component.scss
    │
    └── profile/                   # ✅ Trang profile chi tiết
        ├── profile.component.ts
        ├── profile.component.html
        └── profile.component.scss
```

---

## 🔑 Các Tính Năng Chính

### 1. 🔐 Login
- Form đăng nhập với username/password
- Validation
- Error handling
- Loading state
- Auto redirect sau khi login

### 2. 📊 Dashboard
- Hiển thị thông tin user
- Hiển thị tokens (access + refresh)
- Test API call
- Navigation links

### 3. 👤 Profile
- Thông tin chi tiết user
- Xem full tokens
- Copy tokens to clipboard
- Manual refresh token
- Logout

### 4. 🛡️ HTTP Interceptor
- Tự động thêm `Authorization: Bearer {token}` vào mọi request
- Tự động bắt lỗi 401 (Unauthorized)
- Tự động refresh token khi hết hạn
- Retry request với token mới
- Logout nếu refresh thất bại

### 5. 🚧 Route Guards
- **authGuard**: Bảo vệ routes yêu cầu đăng nhập
- **guestGuard**: Chỉ cho phép truy cập khi chưa đăng nhập
- Auto redirect dựa trên auth state

### 6. 💾 LocalStorage
- Tự động lưu auth state khi login
- Tự động load khi refresh trang
- Tự động xóa khi logout

---

## 🔄 Flow Hoạt Động

### Login Flow
```
1. User nhập username/password
2. Click "Đăng Nhập"
3. authService.login() gọi API
4. API trả về user + tokens
5. authStore.setUser() lưu vào state
6. State được lưu vào localStorage
7. Redirect đến /auth/dashboard
```

### HTTP Interceptor Flow
```
1. Component gọi HTTP request
2. Interceptor bắt request
3. Lấy accessToken từ AuthStore
4. Thêm header: Authorization: Bearer {token}
5. Gửi request
6. Nếu 401 → Refresh token → Retry
7. Nếu refresh fail → Logout
```

### Route Guard Flow
```
1. User navigate đến protected route
2. authGuard kiểm tra isAuthenticated
3. Nếu true → Allow
4. Nếu false → Redirect to /auth/login
```

---

## 📚 Tài Liệu

### 📖 Hướng Dẫn Chi Tiết
**File:** `AUTH_GUIDE.md`

Bao gồm:
- Giải thích chi tiết từng phần
- Flow diagrams
- Code examples
- Best practices
- Bài tập thực hành

### ⚡ Quick Reference
**File:** `AUTH_QUICK_REF.md`

Bao gồm:
- Quick start guide
- Common tasks
- Debug tips
- Test checklist

---

## 🧪 Test Cases

### ✅ Test 1: Login thành công
```
Input: emilys / emilyspass
Expected: Redirect to /auth/dashboard
Check: localStorage có auth_state
```

### ✅ Test 2: Login thất bại
```
Input: wrong / wrong
Expected: Error message hiển thị
Check: Vẫn ở trang login
```

### ✅ Test 3: Auth Guard
```
Action: Truy cập /auth/dashboard khi chưa login
Expected: Redirect to /auth/login
```

### ✅ Test 4: Guest Guard
```
Action: Truy cập /auth/login khi đã login
Expected: Redirect to /auth/dashboard
```

### ✅ Test 5: Logout
```
Action: Click logout
Expected: Clear state, redirect to login
```

### ✅ Test 6: LocalStorage Persistence
```
Action: Login → Refresh trang (F5)
Expected: Vẫn đăng nhập
```

### ✅ Test 7: HTTP Interceptor
```
Action: Click "Test API Call"
Expected: Request có Authorization header
```

### ✅ Test 8: Token Refresh
```
Action: Click "Refresh Token Ngay"
Expected: Tokens mới được tạo và lưu
```

---

## 🎓 Kiến Thức Cần Nắm

### 1. Angular Signals
```typescript
// Signal
const count = signal(0);

// Computed
const double = computed(() => count() * 2);

// Update
count.set(5);
count.update(n => n + 1);
```

### 2. RxJS
```typescript
// Observable
this.http.get('/api/data')

// Operators
.pipe(
  tap(data => console.log(data)),
  catchError(err => throwError(() => err)),
  switchMap(() => otherObservable)
)
```

### 3. HTTP Interceptor
```typescript
export const myInterceptor: HttpInterceptorFn = (req, next) => {
  // Modify request
  const modifiedReq = req.clone({
    setHeaders: { 'X-Custom': 'value' }
  });
  
  // Pass to next
  return next(modifiedReq);
};
```

### 4. Route Guards
```typescript
export const myGuard: CanActivateFn = (route, state) => {
  if (condition) {
    return true; // Allow
  } else {
    return router.createUrlTree(['/login']); // Redirect
  }
};
```

---

## 💡 Tips & Best Practices

### 1. State Management
- ✅ Dùng Signals cho reactive state
- ✅ Tách state logic vào Store
- ✅ Computed cho derived values

### 2. API Calls
- ✅ Tách API logic vào Service
- ✅ Handle errors properly
- ✅ Show loading states

### 3. Security
- ⚠️ LocalStorage không an toàn 100%
- ⚠️ Production nên dùng httpOnly cookies
- ⚠️ Không log sensitive data

### 4. Error Handling
- ✅ Hiển thị error messages cho user
- ✅ Log errors để debug
- ✅ Graceful degradation

---

## 🐛 Troubleshooting

### Vấn đề: Bị logout sau khi refresh
**Nguyên nhân:** LocalStorage không có data  
**Giải pháp:** Check console có lỗi khi load từ localStorage không

### Vấn đề: API call không có token
**Nguyên nhân:** Interceptor chưa được đăng ký  
**Giải pháp:** Check `app.config.ts` có `withInterceptors([authInterceptor])`

### Vấn đề: Guard không hoạt động
**Nguyên nhân:** Route chưa có `canActivate`  
**Giải pháp:** Thêm `canActivate: [authGuard]` vào route

### Vấn đề: Refresh token không tự động
**Nguyên nhân:** Interceptor không bắt 401  
**Giải pháp:** Check logic trong interceptor

---

## 📖 Tài Liệu Tham Khảo

- [DummyJSON API](https://dummyjson.com/docs/auth)
- [Angular Signals](https://angular.io/guide/signals)
- [Angular HTTP](https://angular.io/guide/http)
- [Angular Router](https://angular.io/guide/router)
- [RxJS](https://rxjs.dev)

---

## 🎯 Next Steps

1. ✅ Đọc `AUTH_GUIDE.md` để hiểu chi tiết
2. ✅ Test tất cả các tính năng
3. ✅ Làm các bài tập trong guide
4. ✅ Thử thêm tính năng mới
5. ✅ Áp dụng vào dự án thực tế

---

## 📞 Support

Nếu gặp vấn đề:
1. Check `AUTH_GUIDE.md` phần Troubleshooting
2. Check console có lỗi gì
3. Check Network tab trong DevTools
4. Check localStorage có data không

---

## 🎉 Kết Luận

Module này giúp bạn:
- ✅ Hiểu sâu về Authentication flow
- ✅ Thành thạo Angular Signals
- ✅ Biết cách xử lý tokens
- ✅ Implement security best practices
- ✅ Tự tin xây dựng auth system cho dự án thực tế

**Chúc bạn học tốt! 🚀**

---

**Created:** 2025-12-16  
**Version:** 1.0  
**Author:** Antigravity AI Assistant
