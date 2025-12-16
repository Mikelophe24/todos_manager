# 🚀 JSON SERVER SETUP - Hướng Dẫn Đầy Đủ

## 📋 Mục Lục
1. [JSON Server là gì?](#json-server-intro)
2. [Cài đặt](#installation)
3. [Chạy Server](#running)
4. [API Endpoints](#endpoints)
5. [Authentication](#authentication)
6. [Update Angular Code](#update-angular)
7. [Testing](#testing)

---

## 🎯 1. JSON Server Là Gì? {#json-server-intro}

**JSON Server** là một công cụ tạo **fake REST API** từ file JSON.

### Ưu điểm:
- ✅ Chạy trên **localhost** (máy bạn)
- ✅ Database **thật** (file `db.json`)
- ✅ **CRUD** đầy đủ (Create, Read, Update, Delete)
- ✅ Có thể **tạo user mới** (lưu thật vào file)
- ✅ Chạy **offline**
- ✅ Dễ setup (5 phút)

### So sánh với DummyJSON:

| Đặc điểm | DummyJSON | JSON Server |
|----------|-----------|-------------|
| Vị trí | Internet | Localhost |
| Database | Không sửa được | File JSON (sửa được) |
| Tạo user | Fake | Thật |
| Offline | ❌ | ✅ |
| Authentication | Có sẵn | Cần json-server-auth |

---

## 📦 2. Cài Đặt {#installation}

### Đã cài sẵn trong project:

```bash
# Kiểm tra package.json
"devDependencies": {
  "json-server": "^1.0.0-beta.3",
  "json-server-auth": "^2.1.0"
}
```

### Nếu chưa có, chạy:

```bash
npm install -D json-server json-server-auth
```

---

## 🏃 3. Chạy Server {#running}

### Option 1: Chỉ chạy API Server

```bash
npm run api
```

**Kết quả:**
```
JSON Server Auth started on PORT :3000
http://localhost:3000/

Resources:
http://localhost:3000/users
http://localhost:3000/posts
http://localhost:3000/comments

Home:
http://localhost:3000
```

### Option 2: Chạy cả Angular + API (Recommended)

```bash
npm run dev
```

**Sẽ chạy:**
- Angular: `http://localhost:4200`
- API Server: `http://localhost:3000`

---

## 🌐 4. API Endpoints {#endpoints}

### **Authentication Endpoints:**

#### **POST /register** - Đăng ký user mới

**Request:**
```bash
POST http://localhost:3000/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "username": "newuser",
  "firstName": "New",
  "lastName": "User"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "newuser@example.com",
    "username": "newuser",
    "firstName": "New",
    "lastName": "User"
  }
}
```

**✅ User được lưu vào `db.json`!**

---

#### **POST /login** - Đăng nhập

**Request:**
```bash
POST http://localhost:3000/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

---

### **CRUD Endpoints:**

#### **GET /users** - Lấy tất cả users

```bash
GET http://localhost:3000/users
Authorization: Bearer {accessToken}
```

#### **GET /users/:id** - Lấy user theo ID

```bash
GET http://localhost:3000/users/1
Authorization: Bearer {accessToken}
```

#### **PUT /users/:id** - Cập nhật user

```bash
PUT http://localhost:3000/users/1
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name"
}
```

#### **DELETE /users/:id** - Xóa user

```bash
DELETE http://localhost:3000/users/1
Authorization: Bearer {accessToken}
```

---

## 🔐 5. Authentication {#authentication}

### **json-server-auth** tự động xử lý:

1. **Password hashing** - Tự động hash password khi register
2. **JWT tokens** - Tạo access token
3. **Protected routes** - Yêu cầu token cho các endpoint
4. **Email/Password login** - Hỗ trợ login bằng email

### **Default users trong db.json:**

```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "password": "admin123",  // Sẽ được hash tự động
      "username": "admin"
    },
    {
      "id": 2,
      "email": "user@example.com",
      "password": "user123",
      "username": "user"
    }
  ]
}
```

**⚠️ Lưu ý:** Password trong file là plain text, nhưng khi chạy server, json-server-auth sẽ tự động hash.

---

## 🔧 6. Update Angular Code {#update-angular}

### **Bước 1: Update API URL**

```typescript
// auth.service.ts
export class AuthService {
  // ❌ Cũ - DummyJSON
  // private readonly API_URL = 'https://dummyjson.com/auth';
  
  // ✅ Mới - JSON Server
  private readonly API_URL = 'http://localhost:3000';
}
```

### **Bước 2: Update Login Method**

```typescript
// auth.service.ts
login(credentials: LoginRequest): Observable<LoginResponse> {
  this.authStore.setLoading(true);

  // JSON Server Auth dùng email thay vì username
  const loginData = {
    email: credentials.username + '@example.com',  // Hoặc dùng email field
    password: credentials.password
  };

  return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginData)
    .pipe(
      tap(response => {
        this.authStore.setUser(response);
        console.log('✅ Login successful:', response);
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'Đăng nhập thất bại';
        this.authStore.setError(errorMessage);
        console.error('❌ Login failed:', error);
        return throwError(() => error);
      }),
      finalize(() => this.authStore.setLoading(false))
    );
}
```

### **Bước 3: Thêm Register Method**

```typescript
// auth.service.ts
register(data: RegisterRequest): Observable<RegisterResponse> {
  this.authStore.setLoading(true);

  return this.http.post<RegisterResponse>(`${this.API_URL}/register`, data)
    .pipe(
      tap(response => {
        console.log('✅ Register successful:', response);
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'Đăng ký thất bại';
        this.authStore.setError(errorMessage);
        console.error('❌ Register failed:', error);
        return throwError(() => error);
      }),
      finalize(() => this.authStore.setLoading(false))
    );
}
```

### **Bước 4: Update Auth Models**

```typescript
// auth.model.ts
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}
```

---

## 🧪 7. Testing {#testing}

### **Test với Postman/Thunder Client:**

#### **1. Register User:**

```
POST http://localhost:3000/register

Body (JSON):
{
  "email": "test@example.com",
  "password": "test123",
  "username": "testuser",
  "firstName": "Test",
  "lastName": "User"
}
```

**Kiểm tra `db.json`** - User mới sẽ xuất hiện!

#### **2. Login:**

```
POST http://localhost:3000/login

Body (JSON):
{
  "email": "test@example.com",
  "password": "test123"
}
```

**Copy accessToken từ response**

#### **3. Get Users (Protected):**

```
GET http://localhost:3000/users

Headers:
Authorization: Bearer {accessToken}
```

---

## 📝 8. Database File (db.json)

### **Cấu trúc:**

```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "password": "$2a$10$...",  // Hashed password
      "username": "admin",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    }
  ],
  "posts": [],
  "comments": []
}
```

### **Thêm collection mới:**

```json
{
  "users": [...],
  "posts": [],
  "products": [],  // ← Thêm collection mới
  "orders": []
}
```

**Tự động có endpoints:**
- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

---

## 🎯 9. Tổng Kết

### **Workflow:**

```
1. Chạy JSON Server:
   npm run api

2. Server chạy tại:
   http://localhost:3000

3. Update Angular:
   - Đổi API_URL = 'http://localhost:3000'
   - Update login/register methods

4. Test:
   - Register user mới
   - Login
   - Gọi protected APIs

5. Kiểm tra db.json:
   - Xem users đã được tạo
   - Data được lưu thật!
```

### **Lợi ích:**

✅ **Full control** - Bạn kiểm soát toàn bộ backend
✅ **Real database** - Data được lưu vào file
✅ **Easy testing** - Test CRUD operations dễ dàng
✅ **Offline** - Không cần Internet
✅ **Fast development** - Setup nhanh, focus vào frontend

---

## 🔗 Tài Liệu Tham Khảo

- [JSON Server GitHub](https://github.com/typicode/json-server)
- [JSON Server Auth](https://github.com/jeremyben/json-server-auth)
- [JSON Server Routes](https://github.com/typicode/json-server#routes)

---

## ❓ Troubleshooting

### **Port 3000 đã được sử dụng:**

```bash
# Đổi port trong package.json
"api": "json-server-auth db.json --port 3001"
```

### **CORS errors:**

JSON Server tự động enable CORS, nhưng nếu gặp lỗi:

```bash
"api": "json-server-auth db.json --port 3000 --middlewares ./cors.js"
```

### **Password không hash:**

Đảm bảo dùng `json-server-auth` thay vì `json-server`:

```bash
# ✅ Đúng
json-server-auth db.json

# ❌ Sai
json-server db.json
```

---

Bạn đã sẵn sàng dùng JSON Server! 🎉
