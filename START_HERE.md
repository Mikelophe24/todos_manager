# ⚡ QUICK START - BẮT ĐẦU NGAY

## 🚀 3 Bước Để Chạy

### Bước 1: Mở Terminal
```bash
# Nếu chưa chạy, chạy lệnh:
npm start

# Hoặc
ng serve
```

### Bước 2: Mở Browser
```
http://localhost:4200
```

### Bước 3: Login
```
Username: emilys
Password: emilyspass
```

**🎉 Xong! Bạn đã vào dashboard!**

---

## 📚 Đọc Tài Liệu Theo Thứ Tự

### 1️⃣ Đầu Tiên (5 phút)
📄 **AUTH_INDEX.md** - Xem tổng quan và lộ trình học

### 2️⃣ Tiếp Theo (15 phút)
📄 **AUTH_README.md** - Hiểu module làm gì

### 3️⃣ Sau Đó (30 phút)
📄 **AUTH_QUICK_REF.md** - Tra cứu nhanh các concepts

### 4️⃣ Cuối Cùng (2 giờ)
📄 **AUTH_GUIDE.md** - Đọc chi tiết từng phần

### 5️⃣ Thực Hành (1 giờ)
📄 **AUTH_DEMO_GUIDE.md** - Test tất cả scenarios

---

## 🎯 Test Nhanh 5 Phút

### ✅ Test 1: Login
1. Vào `http://localhost:4200`
2. Login: `emilys` / `emilyspass`
3. ✅ Vào được dashboard

### ✅ Test 2: Logout
1. Click "Đăng Xuất"
2. ✅ Về trang login

### ✅ Test 3: Guard
1. Logout
2. Vào `http://localhost:4200/auth/dashboard`
3. ✅ Tự động redirect về login

### ✅ Test 4: LocalStorage
1. Login
2. F5 (refresh)
3. ✅ Vẫn đăng nhập

### ✅ Test 5: Interceptor
1. Login
2. Click "Test API Call"
3. Mở DevTools → Network
4. ✅ Request có `Authorization` header

---

## 📁 Files Quan Trọng

### Đọc Ngay
- `AUTH_INDEX.md` ← **BẮT ĐẦU TỪ ĐÂY**
- `AUTH_README.md`
- `AUTH_QUICK_REF.md`

### Đọc Sau
- `AUTH_GUIDE.md`
- `AUTH_DEMO_GUIDE.md`

### Code
- `src/app/auth/` ← Tất cả code ở đây

---

## 💡 Nếu Gặp Lỗi

### Lỗi: Cannot find module
```bash
npm install
```

### Lỗi: Port already in use
```bash
# Kill process và chạy lại
ng serve --port 4201
```

### Lỗi: Compile error
- Check console
- Đọc error message
- Check `AUTH_GUIDE.md` → Troubleshooting

---

## 🎓 Lộ Trình Học 1 Tuần

### Ngày 1-2: Hiểu Tổng Quan
- Đọc tài liệu
- Chạy và test
- Xem qua code

### Ngày 3-4: Hiểu Chi Tiết
- Đọc guide chi tiết
- Hiểu từng file
- Debug và experiment

### Ngày 5-6: Thực Hành
- Test tất cả scenarios
- Làm bài tập
- Thêm features

### Ngày 7: Tổng Kết
- Review lại
- Code lại từ đầu
- Áp dụng vào project

---

## 🔗 Links

- [AUTH_INDEX.md](./AUTH_INDEX.md) - **BẮT ĐẦU TỪ ĐÂY**
- [DummyJSON API](https://dummyjson.com/docs/auth)
- [Angular Docs](https://angular.io)

---

## ✅ Checklist

- [ ] Đã chạy app
- [ ] Đã login thành công
- [ ] Đã đọc AUTH_INDEX.md
- [ ] Đã đọc AUTH_README.md
- [ ] Đã test 5 scenarios cơ bản
- [ ] Đã xem qua code
- [ ] Sẵn sàng học tiếp

---

**Bắt đầu từ: [AUTH_INDEX.md](./AUTH_INDEX.md)**

**Happy Learning! 🚀**
