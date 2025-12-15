# 📝 Router Params - Tóm Tắt Nhanh

## 🎯 Khái niệm cốt lõi

**Router Params** = Truyền dữ liệu động qua URL

```
/users/:id  →  /users/1, /users/2, /users/999...
```

## 🔧 3 Bước Cơ Bản

### 1️⃣ Định nghĩa Route
```typescript
// app.routes.ts
{ path: 'users/:id', component: UserDetailComponent }
```

### 2️⃣ Navigate với Param
```typescript
// Template
<div [routerLink]="['/users', user.id]">View User</div>

// TypeScript
this.router.navigate(['/users', userId]);
```

### 3️⃣ Đọc Param trong Component
```typescript
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  
  // Lấy ID từ URL
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );
}
```

## 🎨 Pattern Hoàn Chỉnh

```typescript
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  // Bước 1: Lấy ID từ URL
  userId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('id'))),
    { initialValue: null }
  );

  // Bước 2: Tự động fetch data khi ID thay đổi
  user = toSignal(
    this.route.paramMap.pipe(
      map(p => p.get('id')),
      switchMap(id => this.userService.getUserById(Number(id)))
    ),
    { initialValue: null }
  );

  // Bước 3: Computed state
  isLoading = computed(() => 
    this.userId() !== null && this.user() === null
  );
}
```

## ✅ Best Practices

| ✅ DO | ❌ DON'T |
|-------|----------|
| Dùng `toSignal()` | Dùng `snapshot` khi params thay đổi |
| Dùng `inject()` | Quên `unsubscribe()` với subscribe |
| Validate params | Hardcode params trong URL |
| Xử lý errors | Bỏ qua loading states |

## 🚀 Quick Reference

```typescript
// Lấy 1 param
params.get('id')

// Lấy nhiều params
params.get('category')
params.get('id')

// Convert sang number
Number(params.get('id'))

// Với default value
params.get('id') ?? '1'
```

## 📊 So Sánh Phương Pháp

| Method | Reactive | Auto Update | Code |
|--------|----------|-------------|------|
| `toSignal()` | ✅ | ✅ | ⭐⭐ |
| `subscribe()` | ✅ | ✅ | ⭐⭐⭐ |
| `snapshot` | ❌ | ❌ | ⭐ |

## 🎓 Ví Dụ Thực Tế

```typescript
// Route: /products/:category/:id

// URL: /products/electronics/123
category = "electronics"
id = "123"

// Component
productId = toSignal(
  this.route.paramMap.pipe(
    map(params => ({
      category: params.get('category'),
      id: params.get('id')
    }))
  )
);
```

## 🔍 Debug Tips

```typescript
// Log params để debug
constructor() {
  this.route.paramMap.subscribe(params => {
    console.log('All params:', params.keys);
    console.log('ID:', params.get('id'));
  });
}

// Hoặc với toSignal
userId = toSignal(
  this.route.paramMap.pipe(
    map(params => {
      const id = params.get('id');
      console.log('User ID:', id);
      return id;
    })
  )
);
```

## 💡 Common Patterns

### Pattern 1: Fetch data dựa trên param
```typescript
user = toSignal(
  this.route.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => this.api.getUser(id))
  )
);
```

### Pattern 2: Multiple params
```typescript
data = toSignal(
  this.route.paramMap.pipe(
    map(p => ({
      category: p.get('category'),
      id: p.get('id')
    })),
    switchMap(({ category, id }) => 
      this.api.getProduct(category, id)
    )
  )
);
```

### Pattern 3: Với validation
```typescript
userId = toSignal(
  this.route.paramMap.pipe(
    map(p => {
      const id = Number(p.get('id'));
      if (isNaN(id) || id <= 0) {
        throw new Error('Invalid ID');
      }
      return id;
    })
  )
);
```

## 🎯 Key Takeaways

1. **Router Params** = Dynamic values trong URL
2. **`:paramName`** = Placeholder trong route definition
3. **`toSignal()`** = Modern way để đọc params
4. **`switchMap()`** = Fetch data dựa trên params
5. **`inject()`** = Tránh lỗi initialization

---

**Xem thêm:** [ROUTER_PARAMS_GUIDE.md](./ROUTER_PARAMS_GUIDE.md) để có hướng dẫn chi tiết đầy đủ.
