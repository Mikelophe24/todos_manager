# 🧪 AUTHENTICATION - DEMO & TEST GUIDE

## 🎬 Demo Scenarios

### Scenario 1: Happy Path - Login thành công

**Steps:**
1. Mở `http://localhost:4200`
2. Tự động redirect về `/auth/login`
3. Nhập:
   - Username: `emilys`
   - Password: `emilyspass`
4. Click "Đăng Nhập"

**Expected Results:**
- ✅ Loading spinner hiển thị
- ✅ Redirect về `/auth/dashboard`
- ✅ Hiển thị thông tin user: Emily Johnson
- ✅ Hiển thị avatar
- ✅ Hiển thị access token và refresh token
- ✅ Console log: "✅ Login successful"

**Verify:**
```javascript
// Mở Console và chạy:
localStorage.getItem('auth_state')
// Phải có data
```

---

### Scenario 2: Sad Path - Login thất bại

**Steps:**
1. Ở trang `/auth/login`
2. Nhập:
   - Username: `wronguser`
   - Password: `wrongpass`
3. Click "Đăng Nhập"

**Expected Results:**
- ❌ Error message hiển thị: "Đăng nhập thất bại"
- ❌ Vẫn ở trang login
- ❌ Form không bị clear
- ❌ Console log: "❌ Login failed"

---

### Scenario 3: Route Guard - Chưa login

**Steps:**
1. Logout (nếu đang login)
2. Thử truy cập trực tiếp: `http://localhost:4200/auth/dashboard`

**Expected Results:**
- 🔒 Tự động redirect về `/auth/login`
- 🔒 URL có query param: `?returnUrl=/auth/dashboard`
- 🔒 Console log: "❌ Auth Guard: User not authenticated"

---

### Scenario 4: Route Guard - Đã login

**Steps:**
1. Login thành công
2. Thử truy cập: `http://localhost:4200/auth/login`

**Expected Results:**
- 🔒 Tự động redirect về `/auth/dashboard`
- 🔒 Console log: "❌ Guest Guard: User already authenticated"

---

### Scenario 5: HTTP Interceptor - Auto attach token

**Steps:**
1. Login thành công
2. Ở dashboard, click "🧪 Test API Call"
3. Mở DevTools → Network tab

**Expected Results:**
- ✅ Request đến `https://dummyjson.com/auth/me`
- ✅ Request Headers có: `Authorization: Bearer eyJhbGc...`
- ✅ Response 200 OK
- ✅ Alert: "✅ API call thành công!"
- ✅ Console log user data

**Verify:**
```
DevTools → Network → Click request "me"
→ Headers → Request Headers
→ Tìm "Authorization: Bearer ..."
```

---

### Scenario 6: Token Refresh

**Steps:**
1. Login thành công
2. Navigate đến `/auth/profile`
3. Click "🔄 Refresh Token Ngay"
4. Mở DevTools → Network tab

**Expected Results:**
- ✅ Request đến `https://dummyjson.com/auth/refresh`
- ✅ Loading spinner hiển thị
- ✅ Alert: "✅ Token đã được refresh thành công!"
- ✅ Tokens mới hiển thị trên UI
- ✅ Console log: "✅ Token refreshed successfully"

**Verify:**
```javascript
// Console - So sánh token cũ và mới
localStorage.getItem('auth_state')
```

---

### Scenario 7: LocalStorage Persistence

**Steps:**
1. Login thành công
2. Ở dashboard, note lại username hiển thị
3. Refresh trang (F5)

**Expected Results:**
- ✅ Vẫn ở dashboard (không bị logout)
- ✅ Thông tin user vẫn hiển thị đúng
- ✅ Tokens vẫn còn
- ✅ Console log: "Auth state loaded from localStorage"

**Verify:**
```javascript
// Console
localStorage.getItem('auth_state')
// Parse để xem data
JSON.parse(localStorage.getItem('auth_state'))
```

---

### Scenario 8: Logout

**Steps:**
1. Login thành công
2. Ở dashboard hoặc profile
3. Click "🚪 Đăng Xuất"
4. Confirm dialog

**Expected Results:**
- ✅ Redirect về `/auth/login`
- ✅ LocalStorage cleared
- ✅ Không thể truy cập `/auth/dashboard` nữa
- ✅ Console log: "👋 User logged out"

**Verify:**
```javascript
// Console
localStorage.getItem('auth_state')
// Phải null
```

---

### Scenario 9: Copy Token to Clipboard

**Steps:**
1. Login thành công
2. Navigate đến `/auth/profile`
3. Click "📋 Copy" ở Access Token

**Expected Results:**
- ✅ Alert: "✅ Access Token đã được copy vào clipboard!"
- ✅ Paste vào notepad → Token đầy đủ

---

### Scenario 10: Navigation

**Steps:**
1. Login thành công
2. Ở dashboard, click các navigation links:
   - 📋 Users List
   - 🎬 Movies
   - ✅ Todos
   - 👥 Admin

**Expected Results:**
- ✅ Navigate đến đúng trang
- ✅ Vẫn giữ auth state
- ✅ Có thể quay lại dashboard

---

## 🔍 Detailed Testing

### Test HTTP Interceptor với External API

**Setup:**
Tạo một test component:

```typescript
// test-api.component.ts
export class TestApiComponent {
  http = inject(HttpClient);
  
  testProtectedApi() {
    // Token sẽ tự động được thêm vào header
    this.http.get('https://dummyjson.com/auth/products/1')
      .subscribe({
        next: (data) => console.log('✅ Data:', data),
        error: (err) => console.error('❌ Error:', err)
      });
  }
}
```

**Expected:**
- Request có header `Authorization: Bearer ...`

---

### Test 401 Auto Refresh

**Scenario:**
Token hết hạn → API trả 401 → Auto refresh → Retry

**Note:** DummyJSON tokens không thực sự hết hạn, nên khó test scenario này.

**Workaround:**
Modify interceptor để force refresh:

```typescript
// Temporary test code
if (req.url.includes('/test-401')) {
  // Simulate 401
  return throwError(() => ({ status: 401 }));
}
```

---

## 📊 Test Matrix

| Test Case | Input | Expected | Status |
|-----------|-------|----------|--------|
| Login success | emilys/emilyspass | Dashboard | ✅ |
| Login fail | wrong/wrong | Error msg | ✅ |
| Auth guard (not logged in) | Access /dashboard | Redirect login | ✅ |
| Guest guard (logged in) | Access /login | Redirect dashboard | ✅ |
| HTTP interceptor | API call | Token in header | ✅ |
| Token refresh | Manual refresh | New tokens | ✅ |
| LocalStorage | F5 refresh | Still logged in | ✅ |
| Logout | Click logout | Redirect login | ✅ |
| Copy token | Click copy | Token in clipboard | ✅ |
| Navigation | Click links | Navigate correctly | ✅ |

---

## 🐛 Debug Checklist

### Nếu login không hoạt động:

- [ ] Check console có lỗi?
- [ ] Check Network tab → Request đến API?
- [ ] Check Response có data?
- [ ] Check authStore.setUser() được gọi?
- [ ] Check localStorage có data?

### Nếu interceptor không hoạt động:

- [ ] Check app.config.ts có đăng ký interceptor?
- [ ] Check Network tab → Request có Authorization header?
- [ ] Check authStore.accessToken() có giá trị?

### Nếu guard không hoạt động:

- [ ] Check routes có canActivate?
- [ ] Check authStore.isAuthenticated() trả về gì?
- [ ] Check console có log từ guard?

### Nếu localStorage không hoạt động:

- [ ] Check browser có block localStorage?
- [ ] Check private/incognito mode?
- [ ] Check authStore.saveToLocalStorage() được gọi?

---

## 📝 Manual Test Script

Copy script này và test từng bước:

```
✅ TEST 1: Login Success
1. Go to http://localhost:4200
2. Enter: emilys / emilyspass
3. Click login
4. Verify: Dashboard shows "Emily Johnson"

✅ TEST 2: Login Fail
1. Enter: wrong / wrong
2. Click login
3. Verify: Error message shows

✅ TEST 3: Auth Guard
1. Logout
2. Go to http://localhost:4200/auth/dashboard
3. Verify: Redirected to /auth/login

✅ TEST 4: Guest Guard
1. Login
2. Go to http://localhost:4200/auth/login
3. Verify: Redirected to /auth/dashboard

✅ TEST 5: HTTP Interceptor
1. Login
2. Click "Test API Call"
3. Open DevTools → Network
4. Verify: Request has Authorization header

✅ TEST 6: Token Refresh
1. Login
2. Go to /auth/profile
3. Click "Refresh Token Ngay"
4. Verify: Alert shows success

✅ TEST 7: LocalStorage
1. Login
2. Press F5
3. Verify: Still logged in

✅ TEST 8: Logout
1. Click logout
2. Verify: Redirected to login
3. Verify: localStorage cleared

✅ TEST 9: Copy Token
1. Go to /auth/profile
2. Click "Copy" button
3. Paste in notepad
4. Verify: Token is there

✅ TEST 10: Navigation
1. Login
2. Click navigation links
3. Verify: All links work
```

---

## 🎯 Performance Test

### Measure Login Time

```javascript
// Console
console.time('login');
// Click login button
// After redirect to dashboard:
console.timeEnd('login');
// Should be < 2 seconds
```

### Measure Interceptor Overhead

```javascript
// Console
console.time('api-call');
// Click "Test API Call"
// After response:
console.timeEnd('api-call');
// Should be minimal overhead
```

---

## 📸 Screenshots Checklist

Để verify UI:

- [ ] Login page - Empty state
- [ ] Login page - With error
- [ ] Login page - Loading state
- [ ] Dashboard - User info
- [ ] Dashboard - Tokens
- [ ] Profile - Full view
- [ ] Profile - After refresh token

---

## 🎓 Learning Exercises

### Exercise 1: Add "Remember Me"
Thêm checkbox "Ghi nhớ đăng nhập"
- Nếu check: lưu vào localStorage
- Nếu không: dùng sessionStorage

### Exercise 2: Add Token Expiry Timer
Hiển thị countdown timer cho token expiry

### Exercise 3: Add User Avatar Upload
Cho phép user upload avatar mới

### Exercise 4: Add Password Change
Thêm form đổi password

### Exercise 5: Add Login History
Lưu lịch sử đăng nhập (timestamp, IP, device)

---

## 🔗 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Login |
| `/auth/refresh` | POST | Refresh token |
| `/auth/me` | GET | Get current user |

---

## 📚 Additional Resources

- [DummyJSON Auth Docs](https://dummyjson.com/docs/auth)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [RxJS Testing](https://rxjs.dev/guide/testing)

---

**Happy Testing! 🧪**
