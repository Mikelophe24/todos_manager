# 📚 Tài Liệu Dự Án - Router Params Demo

## 📖 Danh Sách Tài Liệu

Dự án này bao gồm các tài liệu sau:

### 1. **PROJECT_README.md** 📘
**Mục đích:** Tổng quan về dự án

**Nội dung:**
- Giới thiệu dự án
- Tính năng chính
- Cấu trúc thư mục
- Hướng dẫn cài đặt và chạy
- Kiến thức học được
- Technologies sử dụng

**Đọc khi:** Bắt đầu với dự án

---

### 2. **ROUTER_PARAMS_GUIDE.md** 📕
**Mục đích:** Hướng dẫn chi tiết về Router Params

**Nội dung:**
- Router Params là gì?
- Cách hoạt động chi tiết
- Cấu hình routes
- 3 cách lấy params (toSignal, subscribe, snapshot)
- Ví dụ thực tế từng bước
- So sánh các phương pháp
- Best practices
- Common pitfalls

**Đọc khi:** Muốn hiểu sâu về Router Params

---

### 3. **ROUTER_PARAMS_QUICK_REF.md** 📗
**Mục đích:** Tham khảo nhanh

**Nội dung:**
- 3 bước cơ bản
- Pattern hoàn chỉnh
- Quick reference code
- So sánh phương pháp
- Common patterns
- Debug tips

**Đọc khi:** Cần tra cứu nhanh syntax

---

### 4. **INDEX.md** (File này) 📙
**Mục đích:** Chỉ mục tất cả tài liệu

---

## 🎯 Lộ Trình Học

### Cho người mới bắt đầu:
```
1. Đọc PROJECT_README.md (15 phút)
   ↓
2. Chạy ứng dụng và test (10 phút)
   ↓
3. Đọc ROUTER_PARAMS_GUIDE.md (30 phút)
   ↓
4. Xem code trong dự án (20 phút)
   ↓
5. Thử modify và experiment (30 phút)
```

### Cho người đã có kinh nghiệm:
```
1. Đọc ROUTER_PARAMS_QUICK_REF.md (5 phút)
   ↓
2. Xem code examples trong dự án (10 phút)
   ↓
3. Tham khảo ROUTER_PARAMS_GUIDE.md khi cần (as needed)
```

---

## 📂 Cấu Trúc Code

### Components
```
src/app/components/
├── user/
│   └── user.ts              # Danh sách users
└── user-detail/
    └── user-detail.ts       # Chi tiết user (có Router Params)
```

### Services
```
src/app/services/
└── user.ts                  # UserService với getUserById()
```

### Routing
```
src/app/
└── app.routes.ts            # Route config với :id param
```

---

## 🔑 Key Concepts

### 1. Route Definition
```typescript
{ path: 'users/:id', component: UserDetailComponent }
```

### 2. Navigation
```typescript
[routerLink]="['/users', user.id]"
```

### 3. Reading Params
```typescript
userId = toSignal(
  this.route.paramMap.pipe(map(p => p.get('id')))
);
```

### 4. Fetching Data
```typescript
user = toSignal(
  this.route.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => this.service.getUserById(id))
  )
);
```

---

## 💡 Quick Tips

### ✅ Best Practices
- Dùng `toSignal()` thay vì `subscribe()`
- Dùng `inject()` thay vì constructor injection
- Luôn validate params
- Xử lý error cases
- Hiển thị loading states

### ❌ Common Mistakes
- Dùng `snapshot` khi params có thể thay đổi
- Quên unsubscribe với `subscribe()`
- Không validate params
- Hardcode URLs
- Bỏ qua error handling

---

## 🎓 Learning Checklist

Sau khi hoàn thành dự án này, bạn nên:

- [ ] Hiểu cách định nghĩa route với params
- [ ] Biết cách navigate với params
- [ ] Sử dụng thành thạo `toSignal()` với `paramMap`
- [ ] Kết hợp routing với HTTP calls
- [ ] Hiểu sự khác biệt giữa `toSignal()`, `subscribe()`, và `snapshot`
- [ ] Áp dụng được best practices
- [ ] Xử lý được errors và loading states
- [ ] Sử dụng `inject()` thay vì constructor DI

---

## 📞 Hỗ Trợ

### Gặp vấn đề?

1. **Đọc lại tài liệu:** Kiểm tra ROUTER_PARAMS_GUIDE.md
2. **Xem code mẫu:** So sánh với code trong dự án
3. **Debug:** Sử dụng `console.log()` để trace params
4. **DevTools:** Mở Network tab để kiểm tra API calls

### Resources
- [Angular Router Docs](https://angular.dev/guide/routing)
- [RxJS Operators](https://rxjs.dev/api)
- [Angular Signals](https://angular.dev/guide/signals)

---

## 🚀 Next Steps

Sau khi master Router Params, học tiếp:

1. **Query Params** - `/search?q=angular&page=2`
2. **Route Guards** - Bảo vệ routes
3. **Lazy Loading** - Load components on demand
4. **Nested Routes** - Routes lồng nhau
5. **Route Resolvers** - Pre-fetch data

---

## 📊 Document Map

```
INDEX.md (bạn đang ở đây)
    │
    ├─→ PROJECT_README.md
    │   └─→ Tổng quan dự án
    │
    ├─→ ROUTER_PARAMS_GUIDE.md
    │   └─→ Hướng dẫn chi tiết
    │
    └─→ ROUTER_PARAMS_QUICK_REF.md
        └─→ Tham khảo nhanh
```

---

## 🎯 Mục Tiêu Học Tập

**Beginner Level:**
- ✅ Hiểu Router Params là gì
- ✅ Biết cách định nghĩa route với param
- ✅ Navigate với param cơ bản

**Intermediate Level:**
- ✅ Sử dụng `toSignal()` với `paramMap`
- ✅ Fetch data dựa trên params
- ✅ Xử lý loading và error states

**Advanced Level:**
- ✅ Multiple params
- ✅ Complex validation
- ✅ Combine với query params
- ✅ Optimize performance

---

**Happy Learning! 🎉**

Bắt đầu với [PROJECT_README.md](./PROJECT_README.md) →
