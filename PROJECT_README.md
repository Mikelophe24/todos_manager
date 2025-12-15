# 🚀 Angular Router Params Demo Project

Dự án demo minh họa cách sử dụng **Router Parameters** trong Angular với **Signals** và **RxJS**.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Kiến thức học được](#kiến-thức-học-được)
- [Tài liệu chi tiết](#tài-liệu-chi-tiết)

## 🎯 Tổng quan

Dự án này demo một ứng dụng Angular đơn giản với 2 trang:

1. **Danh sách người dùng** (`/users`) - Hiển thị tất cả users
2. **Chi tiết người dùng** (`/users/:id`) - Hiển thị thông tin chi tiết của 1 user

**Điểm nổi bật:**
- ✅ Sử dụng Angular **Signals** (Modern approach)
- ✅ Sử dụng **Router Params** để truyền ID qua URL
- ✅ Tích hợp **RxJS** với `toSignal()`
- ✅ Fetch data từ API thực (JSONPlaceholder)
- ✅ Responsive design với gradient đẹp mắt

## ✨ Tính năng

### 1. Danh sách người dùng
- Hiển thị grid card của tất cả users
- Hover effect với animation mượt mà
- Click vào card để xem chi tiết
- Loading state với spinner

### 2. Chi tiết người dùng
- Hiển thị đầy đủ thông tin user:
  - 📞 Thông tin liên hệ (email, phone, website)
  - 📍 Địa chỉ (street, city, zipcode, tọa độ)
  - 🏢 Thông tin công ty
- Debug panel hiển thị User ID từ URL
- Nút quay lại danh sách
- Error handling khi user không tồn tại

## 📁 Cấu trúc dự án

```
tuhoc2/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── user/
│   │   │   │   └── user.ts              # Component danh sách users
│   │   │   └── user-detail/
│   │   │       └── user-detail.ts       # Component chi tiết user
│   │   ├── services/
│   │   │   └── user.ts                  # UserService (API calls)
│   │   ├── app.routes.ts                # Cấu hình routing
│   │   ├── app.ts                       # Root component
│   │   └── app.html                     # Root template
│   └── main.ts                          # Entry point
├── ROUTER_PARAMS_GUIDE.md              # Hướng dẫn chi tiết về Router Params
└── README.md                            # File này
```

## 🔧 Cài đặt

### Yêu cầu
- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 19.x

### Các bước cài đặt

```bash
# 1. Clone hoặc tải dự án về
cd tuhoc2/tuhoc2

# 2. Cài đặt dependencies (nếu chưa có)
npm install

# 3. Chạy development server
ng serve

# 4. Mở trình duyệt tại
http://localhost:4200
```

## 🚀 Chạy ứng dụng

```bash
# Development server
ng serve

# Build production
ng build

# Run tests
ng test
```

## 📚 Kiến thức học được

### 1. **Routing cơ bản**
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserComponent },
  { path: 'users/:id', component: UserDetailComponent }  // Route với param
];
```

**Học được:**
- Cách định nghĩa routes
- Redirect route
- Route parameters với `:id`
- `pathMatch: 'full'` vs `'prefix'`

### 2. **Router Parameters**
```typescript
// Lấy userId từ URL
userId = toSignal(
  this.route.paramMap.pipe(
    map(params => params.get('id'))
  ),
  { initialValue: null }
);
```

**Học được:**
- Sử dụng `ActivatedRoute`
- `paramMap` Observable
- Chuyển đổi Observable → Signal với `toSignal()`

### 3. **Reactive Data Fetching**
```typescript
// Tự động fetch data khi URL thay đổi
user = toSignal(
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => this.userService.getUserById(Number(id)))
  ),
  { initialValue: null }
);
```

**Học được:**
- RxJS operators: `map`, `switchMap`
- Kết hợp routing với HTTP calls
- Reactive programming pattern

### 4. **Angular Signals**
```typescript
// Computed signal
isLoading = computed(() => 
  this.userId() !== null && this.user() === null
);
```

**Học được:**
- Signals cơ bản
- Computed signals
- Reactive UI updates

### 5. **Dependency Injection Modern**
```typescript
// Sử dụng inject() thay vì constructor
private route = inject(ActivatedRoute);
private userService = inject(UserService);
```

**Học được:**
- `inject()` function
- Tránh lỗi initialization với signals
- Modern DI pattern

### 6. **Navigation**
```typescript
// Template
<div [routerLink]="['/users', user.id]">
  Click to view
</div>

// TypeScript
this.router.navigate(['/users', userId]);
```

**Học được:**
- `routerLink` directive
- Programmatic navigation
- Truyền parameters khi navigate

## 📖 Tài liệu chi tiết

Xem file [ROUTER_PARAMS_GUIDE.md](./ROUTER_PARAMS_GUIDE.md) để có hướng dẫn chi tiết về:
- Router Params là gì?
- Cách hoạt động
- So sánh các phương pháp
- Best practices
- Ví dụ nâng cao

## 🎨 UI/UX Features

- **Gradient Background**: Linear gradient tím đẹp mắt
- **Card Design**: Modern card với shadow và hover effects
- **Responsive**: Tự động điều chỉnh trên mobile
- **Loading States**: Spinner animation khi đang tải
- **Error Handling**: Hiển thị thông báo khi không tìm thấy user
- **Debug Panel**: Panel màu vàng hiển thị thông tin debug

## 🔍 Demo Flow

```
1. User vào trang chủ (/)
   ↓
2. Tự động redirect → /users
   ↓
3. Hiển thị danh sách 10 users từ API
   ↓
4. Click vào user card
   ↓
5. Navigate → /users/1 (hoặc ID khác)
   ↓
6. Component đọc :id từ URL
   ↓
7. Tự động fetch user detail từ API
   ↓
8. Hiển thị thông tin chi tiết
   ↓
9. Click "Quay lại" → /users
```

## 🛠️ Technologies

- **Angular 19** - Framework
- **TypeScript** - Language
- **RxJS** - Reactive programming
- **Angular Signals** - State management
- **Angular Router** - Routing
- **JSONPlaceholder API** - Mock data

## 📝 Code Highlights

### Route Configuration
```typescript
{
  path: 'users/:id',  // Dynamic parameter
  component: UserDetailComponent
}
```

### Signal-based Param Reading
```typescript
userId = toSignal(
  this.route.paramMap.pipe(map(params => params.get('id'))),
  { initialValue: null }
);
```

### Reactive Data Loading
```typescript
user = toSignal(
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => this.userService.getUserById(Number(id)))
  ),
  { initialValue: null }
);
```

## 🎓 Learning Outcomes

Sau khi học xong dự án này, bạn sẽ:

✅ Hiểu rõ cách hoạt động của Router Parameters  
✅ Biết cách kết hợp Signals với RxJS  
✅ Sử dụng thành thạo `toSignal()`  
✅ Implement reactive data fetching  
✅ Xử lý routing trong Angular modern  
✅ Áp dụng best practices cho DI và routing  

## 🐛 Troubleshooting

### Lỗi: "Cannot find module"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Property 'route' is used before initialization"
```typescript
// ❌ Sai
constructor(private route: ActivatedRoute) {}
userId = toSignal(this.route.paramMap...);

// ✅ Đúng
private route = inject(ActivatedRoute);
userId = toSignal(this.route.paramMap...);
```

### API không load được
- Kiểm tra kết nối internet
- API sử dụng: https://jsonplaceholder.typicode.com/users
- Mở DevTools → Network tab để debug

## 🤝 Contributing

Đây là dự án học tập. Feel free to:
- Fork và thử nghiệm
- Thêm features mới
- Cải thiện UI/UX
- Refactor code

## 📄 License

MIT License - Free to use for learning purposes

## 👨‍💻 Author

**Antigravity AI**  
Dự án demo cho việc học Angular Router Params

---

**Happy Coding! 🚀**
