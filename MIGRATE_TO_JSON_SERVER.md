# 🔄 CHUYỂN TỪ DUMMYJSON SANG JSON SERVER

## ✅ JSON Server đã chạy tại: http://localhost:3000

### Endpoints có sẵn:
- `http://localhost:3000/users` - Quản lý users
- `http://localhost:3000/posts` - Quản lý posts  
- `http://localhost:3000/comments` - Quản lý comments

---

## 📝 CẬP NHẬT CODE ANGULAR

### Bước 1: Update API URL trong Auth Service

```typescript
// src/app/auth/services/auth.service.ts

export class AuthService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);

  // ❌ CŨ - DummyJSON
  // private readonly API_URL = 'https://dummyjson.com/auth';
  
  // ✅ MỚI - JSON Server
  private readonly API_URL = 'http://localhost:3000';
}
```

---

### Bước 2: Update Login Method

JSON Server không có endpoint `/auth/login`, chỉ có `/users`.  
Bạn cần tự implement logic login:

```typescript
// src/app/auth/services/auth.service.ts

login(credentials: LoginRequest): Observable<LoginResponse> {
  this.authStore.setLoading(true);

  // Lấy tất cả users và tìm user khớp
  return this.http.get<any[]>(`${this.API_URL}/users`).pipe(
    map(users => {
      // Tìm user có username và password khớp
      const user = users.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Tạo fake token (trong production dùng JWT thật)
      const fakeToken = btoa(JSON.stringify({ 
        id: user.id, 
        username: user.username,
        exp: Date.now() + 30 * 60 * 1000 // 30 phút
      }));

      return {
        ...user,
        accessToken: fakeToken,
        refreshToken: fakeToken
      };
    }),
    tap(response => {
      this.authStore.setUser(response);
      console.log('✅ Login successful:', response);
    }),
    catchError(error => {
      const errorMessage = error.message || 'Đăng nhập thất bại';
      this.authStore.setError(errorMessage);
      console.error('❌ Login failed:', error);
      return throwError(() => error);
    }),
    finalize(() => this.authStore.setLoading(false))
  );
}
```

---

### Bước 3: Thêm Register Method

```typescript
// src/app/auth/services/auth.service.ts

register(data: RegisterRequest): Observable<any> {
  this.authStore.setLoading(true);

  // Kiểm tra username đã tồn tại chưa
  return this.http.get<any[]>(`${this.API_URL}/users`).pipe(
    switchMap(users => {
      const existingUser = users.find(u => u.username === data.username);
      
      if (existingUser) {
        throw new Error('Username đã tồn tại!');
      }

      // Tạo user mới
      const newUser = {
        username: data.username,
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: `https://i.pravatar.cc/150?img=${users.length + 1}`,
        createdAt: new Date().toISOString()
      };

      // POST user mới vào JSON Server
      return this.http.post(`${this.API_URL}/users`, newUser);
    }),
    tap(response => {
      console.log('✅ Register successful:', response);
    }),
    catchError(error => {
      const errorMessage = error.message || 'Đăng ký thất bại';
      this.authStore.setError(errorMessage);
      console.error('❌ Register failed:', error);
      return throwError(() => error);
    }),
    finalize(() => this.authStore.setLoading(false))
  );
}
```

---

### Bước 4: Update Auth Models

```typescript
// src/app/auth/models/auth.model.ts

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}
```

---

## 🧪 TEST API VỚI POSTMAN/BROWSER

### 1. Xem tất cả users:
```
GET http://localhost:3000/users
```

### 2. Tạo user mới:
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "email": "new@example.com",
  "firstName": "New",
  "lastName": "User"
}
```

### 3. Xem user theo ID:
```
GET http://localhost:3000/users/1
```

### 4. Update user:
```
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "firstName": "Updated"
}
```

### 5. Xóa user:
```
DELETE http://localhost:3000/users/1
```

---

## 📊 KIỂM TRA DATABASE

Mở file `db.json` để xem data:

```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "password": "admin123",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User"
    },
    {
      "id": 2,
      "username": "user",
      "password": "user123",
      "email": "user@example.com",
      "firstName": "Test",
      "lastName": "User"
    }
  ]
}
```

**✅ Mỗi khi tạo/sửa/xóa user, file này sẽ tự động cập nhật!**

---

## 🎯 TỔNG KẾT

### Đã làm:
✅ Cài đặt JSON Server
✅ Tạo file `db.json` với 2 users mặc định
✅ Chạy server tại `http://localhost:3000`
✅ Có endpoints CRUD đầy đủ

### Cần làm tiếp:
1. Update `auth.service.ts` với code ở trên
2. Tạo Register Component
3. Test login/register

### Lợi ích:
✅ **Full control** - Bạn kiểm soát backend
✅ **Real database** - Data lưu vào file
✅ **Easy CRUD** - Tạo/sửa/xóa user dễ dàng
✅ **Offline** - Không cần Internet

---

## 🚀 NEXT STEPS

Bạn muốn tôi:
1. ✅ Update `auth.service.ts` với code mới?
2. ✅ Tạo Register Component?
3. ✅ Tạo file demo test API?

Cho tôi biết bạn muốn làm gì tiếp theo! 😊
