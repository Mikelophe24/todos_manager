# 💾 TẠI SAO AUTH STATE CẦN LƯU VÀO LOCALSTORAGE?

## 🎯 LÝ DO CHÍNH: PERSIST STATE KHI REFRESH PAGE

### **Vấn đề cốt lõi:**

Angular là **Single Page Application (SPA)**. Khi refresh page (F5), **toàn bộ JavaScript state bị reset**!

---

## 🔴 1. KHÔNG CÓ LOCALSTORAGE - ĐIỀU GÌ XẢY RA?

### **Timeline:**

```
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 1: User login thành công                              │
└─────────────────────────────────────────────────────────────┘

AuthStore (trong memory):
{
  user: { id: 1, username: "hoang" },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  isAuthenticated: true
}

User thấy Dashboard ✅

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 2: User nhấn F5 (refresh page)                        │
└─────────────────────────────────────────────────────────────┘

Browser:
  - Reload toàn bộ page
  - Clear tất cả JavaScript memory
  - Restart Angular app

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 3: Angular restart - State bị reset                   │
└─────────────────────────────────────────────────────────────┘

AuthStore constructor chạy:
  state = signal<AuthState>({
    user: null,              // ← Reset!
    accessToken: null,       // ← Reset!
    refreshToken: null,      // ← Reset!
    isAuthenticated: false   // ← Reset!
  });

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 4: Auth Guard kiểm tra                                │
└─────────────────────────────────────────────────────────────┘

Auth Guard:
  if (!authStore.isAuthenticated()) {
    // isAuthenticated = false
    router.navigate(['/auth/login']);
    return false;
  }

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  KẾT QUẢ: User bị logout!                                   │
└─────────────────────────────────────────────────────────────┘

❌ User bị redirect về login page
😤 Phải nhập username/password lại
❌ Trải nghiệm cực kỳ tệ!
```

---

## ✅ 2. CÓ LOCALSTORAGE - GIẢI PHÁP

### **Timeline:**

```
┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 1: User login thành công                              │
└─────────────────────────────────────────────────────────────┘

AuthStore lưu vào 2 NỠI:

1. Memory (Angular State):
{
  user: { id: 1, username: "hoang" },
  accessToken: "eyJ...",
  isAuthenticated: true
}

2. LocalStorage (Browser Storage):
localStorage.setItem('auth_state', JSON.stringify({
  user: { id: 1, username: "hoang" },
  accessToken: "eyJ...",
  refreshToken: "eyJ...",
  isAuthenticated: true
}));

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 2: User nhấn F5 (refresh page)                        │
└─────────────────────────────────────────────────────────────┘

Browser:
  - Reload page
  - Clear JavaScript memory
  - ✅ NHƯNG localStorage VẪN CÒN!

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 3: Angular restart - Load từ localStorage             │
└─────────────────────────────────────────────────────────────┘

AuthStore constructor:
  constructor() {
    this.loadFromLocalStorage();  // ← Chạy ngay khi khởi tạo
  }

loadFromLocalStorage():
  1. Đọc từ localStorage
  const saved = localStorage.getItem('auth_state');
  
  2. Parse JSON
  const parsed = JSON.parse(saved);
  // {
  //   user: { id: 1, username: "hoang" },
  //   accessToken: "eyJ...",
  //   refreshToken: "eyJ...",
  //   isAuthenticated: true
  // }
  
  3. Restore state
  this.state.update(state => ({
    ...state,
    user: parsed.user,
    accessToken: parsed.accessToken,
    refreshToken: parsed.refreshToken,
    isAuthenticated: parsed.isAuthenticated
  }));

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 4: State đã được restore!                             │
└─────────────────────────────────────────────────────────────┘

AuthStore (sau khi load):
{
  user: { id: 1, username: "hoang" },  // ← Đã restore!
  accessToken: "eyJ...",                // ← Đã restore!
  refreshToken: "eyJ...",               // ← Đã restore!
  isAuthenticated: true                 // ← Đã restore!
}

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  BƯỚC 5: Auth Guard kiểm tra                                │
└─────────────────────────────────────────────────────────────┘

Auth Guard:
  if (!authStore.isAuthenticated()) {
    // isAuthenticated = true ✅
    return true;  // ← Cho phép truy cập
  }

                              ↓

┌─────────────────────────────────────────────────────────────┐
│  KẾT QUẢ: User VẪN ĐĂNG NHẬP!                               │
└─────────────────────────────────────────────────────────────┘

✅ User vẫn ở Dashboard
😊 Không cần login lại
✅ Trải nghiệm tuyệt vời!
```

---

## 📊 3. SO SÁNH: MEMORY vs LOCALSTORAGE

| Đặc điểm | Memory (Angular State) | LocalStorage |
|----------|------------------------|--------------|
| **Vị trí** | RAM | Browser Storage (Disk) |
| **Tốc độ** | Rất nhanh | Nhanh |
| **Khi refresh** | ❌ Bị xóa | ✅ Vẫn còn |
| **Khi đóng tab** | ❌ Bị xóa | ✅ Vẫn còn |
| **Khi đóng browser** | ❌ Bị xóa | ✅ Vẫn còn |
| **Khi tắt máy** | ❌ Bị xóa | ✅ Vẫn còn |
| **Dung lượng** | Unlimited | ~5-10MB |
| **Bảo mật** | ✅ Tốt hơn | ⚠️ Có thể bị XSS |

---

## 💻 4. CODE TRONG PROJECT

### **auth.store.ts:**

```typescript
export class AuthStore {
  // State trong memory
  private state = signal<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false
  });

  constructor() {
    // ✅ Load từ localStorage khi khởi tạo
    this.loadFromLocalStorage();
  }

  /**
   * Lưu vào localStorage mỗi khi state thay đổi
   */
  setUser(response: LoginResponse) {
    this.state.update(state => ({
      ...state,
      user: {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image
      },
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      error: null
    }));

    // ✅ Lưu vào localStorage
    this.saveToLocalStorage();
  }

  /**
   * Lưu state vào localStorage
   */
  private saveToLocalStorage() {
    const currentState = this.state();
    const dataToSave = {
      user: currentState.user,
      accessToken: currentState.accessToken,
      refreshToken: currentState.refreshToken,
      isAuthenticated: currentState.isAuthenticated
    };
    
    // Lưu vào localStorage
    localStorage.setItem('auth_state', JSON.stringify(dataToSave));
  }

  /**
   * Load state từ localStorage
   */
  private loadFromLocalStorage() {
    const saved = localStorage.getItem('auth_state');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Restore state
        this.state.update(state => ({
          ...state,
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
          isAuthenticated: parsed.isAuthenticated
        }));
        
        console.log('✅ Auth state loaded from localStorage');
      } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
        this.clearLocalStorage();
      }
    }
  }

  /**
   * Xóa localStorage khi logout
   */
  logout() {
    this.state.set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });

    // ✅ Xóa khỏi localStorage
    this.clearLocalStorage();
    
    this.router.navigate(['/auth/login']);
  }

  private clearLocalStorage() {
    localStorage.removeItem('auth_state');
  }
}
```

---

## 🔍 5. XEM LOCALSTORAGE TRONG BROWSER

### **Cách xem:**

1. Mở DevTools (F12)
2. Tab **Application** (hoặc **Storage**)
3. Sidebar → **Local Storage** → `http://localhost:4200`
4. Tìm key: `auth_state`

### **Nội dung:**

```json
{
  "user": {
    "id": "b651",
    "username": "hoang",
    "email": "hoang@gmail.com",
    "firstName": "hianbg",
    "lastName": "văn",
    "gender": "male",
    "image": "https://i.pravatar.cc/150?img=4"
  },
  "accessToken": "eyJpZCI6ImI2NTEiLCJ1c2VybmFtZSI6ImhvYW5nIiwiZXhwIjoxNzM0MzQ1NjAwMDAwfQ==",
  "refreshToken": "eyJpZCI6ImI2NTEiLCJ1c2VybmFtZSI6ImhvYW5nIiwiZXhwIjoxNzM2OTM3NjAwMDAwfQ==",
  "isAuthenticated": true
}
```

---

## 🎯 6. CÁC TRƯỜNG HỢP SỬ DỤNG

### **Khi nào localStorage được dùng?**

1. **Refresh page (F5):**
   ```
   User nhấn F5
       ↓
   Angular restart
       ↓
   Load từ localStorage
       ↓
   ✅ User vẫn login
   ```

2. **Đóng tab và mở lại:**
   ```
   User đóng tab
       ↓
   Mở tab mới → vào app
       ↓
   Load từ localStorage
       ↓
   ✅ User vẫn login
   ```

3. **Đóng browser và mở lại:**
   ```
   User đóng browser
       ↓
   Mở browser → vào app
       ↓
   Load từ localStorage
       ↓
   ✅ User vẫn login
   ```

4. **Tắt máy và bật lại:**
   ```
   User tắt máy
       ↓
   Bật máy → mở browser → vào app
       ↓
   Load từ localStorage
       ↓
   ✅ User vẫn login (nếu token chưa hết hạn)
   ```

---

## 🔐 7. BẢO MẬT VỚI LOCALSTORAGE

### **Rủi ro:**

1. **XSS (Cross-Site Scripting):**
   ```javascript
   // Nếu có lỗ hổng XSS, hacker có thể:
   const token = localStorage.getItem('auth_state');
   // Gửi token về server của hacker
   ```

2. **Ai cũng đọc được:**
   - Mở DevTools → Application → Local Storage
   - Copy token

### **Giải pháp:**

1. **HttpOnly Cookies (Tốt nhất):**
   ```
   ✅ JavaScript không đọc được
   ✅ Tự động gửi trong request
   ❌ Phức tạp hơn để implement
   ```

2. **Encrypt data:**
   ```typescript
   // Mã hóa trước khi lưu
   const encrypted = CryptoJS.AES.encrypt(
     JSON.stringify(data), 
     SECRET_KEY
   ).toString();
   localStorage.setItem('auth_state', encrypted);
   ```

3. **Short-lived tokens:**
   ```
   ✅ Access Token: 30 phút
   ✅ Refresh Token: 30 ngày
   ✅ Nếu bị đánh cắp, chỉ dùng được 30 phút
   ```

4. **Token Rotation:**
   ```
   Mỗi lần refresh → Tạo refresh token mới
   Revoke refresh token cũ
   ```

---

## 💡 8. VÍ DỤ THỰC TẾ

### **Giống như:**

```
🏪 Siêu thị:

Memory (Angular State) = Giỏ hàng trong tay
  - Nhanh, tiện
  - Nhưng nếu bỏ xuống → Mất hết

LocalStorage = Ghi vào giấy
  - Chậm hơn một chút
  - Nhưng bỏ xuống → Vẫn còn
  - Nhặt lên đọc lại → Nhớ lại được
```

### **Trong app:**

```
Memory (Angular State):
  - Dùng trong lúc app đang chạy
  - Nhanh, real-time
  - Nhưng refresh → Mất

LocalStorage:
  - Backup để restore khi refresh
  - Persist giữa các sessions
  - Không mất khi reload
```

---

## 📝 9. TÓM TẮT

### **Tại sao cần localStorage?**

1. ✅ **Persist state khi refresh page**
   - Angular restart → State bị reset
   - LocalStorage → Restore lại state

2. ✅ **Không cần login lại**
   - User refresh page
   - Load state từ localStorage
   - Vẫn authenticated

3. ✅ **Trải nghiệm tốt hơn**
   - Seamless experience
   - Không bị logout bất ngờ

4. ✅ **Session persistence**
   - Đóng tab/browser
   - Mở lại vẫn login

### **Flow hoàn chỉnh:**

```
Login
    ↓
Lưu vào Memory + LocalStorage
    ↓
Dùng app (đọc từ Memory - nhanh)
    ↓
Refresh page
    ↓
Load từ LocalStorage
    ↓
Restore Memory
    ↓
✅ Vẫn login!
```

### **Lưu ý bảo mật:**

- ⚠️ LocalStorage có thể bị XSS
- ✅ Dùng short-lived tokens
- ✅ Implement token rotation
- ✅ Consider HttpOnly cookies cho production

---

Bây giờ bạn hiểu tại sao cần localStorage chưa? 😊
