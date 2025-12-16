# 🔍 FRONTEND GỌI DATABASE Ở ĐÂU?

## 🎯 TRẢ LỜI NGẮN GỌN:

Frontend **KHÔNG** gọi database trực tiếp!  
Frontend gọi **HTTP API** → JSON Server xử lý → Database

**Vị trí chính xác:** `auth.service.ts` - **Line 46**

---

## 📍 VỊ TRÍ TRONG CODE

```typescript
// File: auth.service.ts
// Line 46: ★★★ ĐÂY LÀ NƠI GỌI DATABASE! ★★★

return this.http.get<any[]>(`${this.API_URL}/users`).pipe(
```

---

## 📊 TẤT CẢ NƠI GỌI DATABASE

| Chức năng | File | Line | Method | Endpoint |
|-----------|------|------|--------|----------|
| **Login** | auth.service.ts | 46 | GET | /users |
| **Register** | auth.service.ts | 119 | POST | /users |
| **Get User** | auth.service.ts | 202 | GET | /users/:id |

---

Bạn đã hiểu rõ chưa? 😊
