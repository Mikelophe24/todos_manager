# 📚 Hướng Dẫn Chi Tiết: Router Params trong Angular

## 🎯 Mục Lục
1. [Router Params là gì?](#router-params-là-gì)
2. [Cách hoạt động](#cách-hoạt-động)
3. [Cấu hình Routes](#cấu-hình-routes)
4. [Lấy params trong Component](#lấy-params-trong-component)
5. [Ví dụ thực tế trong dự án](#ví-dụ-thực-tế-trong-dự-án)
6. [So sánh các cách lấy params](#so-sánh-các-cách-lấy-params)
7. [Best Practices](#best-practices)

---

## Router Params là gì?

**Router Params** (Route Parameters) là các **giá trị động** được truyền qua URL để xác định tài nguyên cụ thể mà bạn muốn hiển thị.

### Ví dụ thực tế:
```
❌ Cách cũ (không linh hoạt):
/user-1
/user-2
/user-3
...phải tạo 1000 routes cho 1000 users!

✅ Cách mới (với params):
/users/:id
→ /users/1
→ /users/2
→ /users/999
...chỉ cần 1 route!
```

---

## Cách hoạt động

### 1. **Định nghĩa Route với Parameter**

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'users/:id',  // :id là route parameter
    component: UserDetailComponent
  }
];
```

**Giải thích:**
- `:id` là **placeholder** cho giá trị động
- Bạn có thể đặt tên bất kỳ: `:userId`, `:productId`, `:slug`, v.v.
- Có thể có nhiều params: `products/:category/:id`

### 2. **Navigate đến Route**

```typescript
// Cách 1: Sử dụng routerLink trong template
<div [routerLink]="['/users', user.id]">
  Click to view user {{ user.id }}
</div>

// Cách 2: Sử dụng Router trong TypeScript
constructor(private router: Router) {}

viewUser(userId: number) {
  this.router.navigate(['/users', userId]);
}
```

### 3. **Lấy giá trị params trong Component**

```typescript
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  
  // Lấy userId từ URL
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );
}
```

---

## Cấu hình Routes

### Route đơn giản với 1 parameter

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'users/:id',
    component: UserDetailComponent
  }
];
```

**URL examples:**
- `/users/1` → `id = "1"`
- `/users/42` → `id = "42"`
- `/users/abc` → `id = "abc"`

### Route với nhiều parameters

```typescript
export const routes: Routes = [
  {
    path: 'products/:category/:id',
    component: ProductDetailComponent
  }
];
```

**URL examples:**
- `/products/electronics/123` → `category = "electronics"`, `id = "123"`
- `/products/books/456` → `category = "books"`, `id = "456"`

### Route với optional parameters

```typescript
export const routes: Routes = [
  {
    path: 'search/:query',
    component: SearchComponent
  },
  {
    path: 'search',  // Không có query
    component: SearchComponent
  }
];
```

---

## Lấy params trong Component

### ✅ Cách 1: Sử dụng `toSignal()` (Modern - Recommended)

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';

@Component({...})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  // 🎯 Lấy userId từ URL
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );

  // 🎯 Tự động fetch data khi userId thay đổi
  user = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.userService.getUserById(Number(id)))
    ),
    { initialValue: null }
  );
}
```

**Ưu điểm:**
- ✅ Tự động cập nhật khi URL thay đổi
- ✅ Tích hợp tốt với Angular Signals
- ✅ Reactive và declarative
- ✅ Tự động unsubscribe khi component destroy

### Cách 2: Sử dụng `subscribe()` (Traditional)

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({...})
export class UserDetailComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  private subscription?: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      console.log('User ID:', this.userId);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe(); // ⚠️ Phải nhớ unsubscribe!
  }
}
```

**Nhược điểm:**
- ❌ Phải tự quản lý subscription
- ❌ Dễ quên unsubscribe → memory leak
- ❌ Code dài hơn

### Cách 3: Snapshot (Chỉ lấy 1 lần)

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({...})
export class UserDetailComponent implements OnInit {
  userId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // ⚠️ Chỉ lấy giá trị tại thời điểm component được tạo
    this.userId = this.route.snapshot.paramMap.get('id');
  }
}
```

**Khi nào dùng:**
- ✅ Khi chắc chắn params không thay đổi
- ❌ KHÔNG dùng khi navigate trong cùng component

**Ví dụ lỗi:**
```typescript
// User đang xem /users/1
// Click vào link /users/2
// Component KHÔNG re-render → vẫn hiển thị user 1!
```

---

## Ví dụ thực tế trong dự án

### 1. **Cấu hình Routes** (`app.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user';
import { UserDetailComponent } from './components/user-detail/user-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserComponent  // Danh sách users
  },
  {
    path: 'users/:id',  // 🎯 Route với parameter
    component: UserDetailComponent  // Chi tiết 1 user
  }
];
```

### 2. **Service lấy data** (`user.service.ts`)

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  // Lấy tất cả users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 🎯 Lấy 1 user theo ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
```

### 3. **Component danh sách** (`user.component.ts`)

```typescript
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-grid">
      <div *ngFor="let user of users()" 
           class="user-card"
           [routerLink]="['/users', user.id]">  <!-- 🎯 Navigate với param -->
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </div>
    </div>
  `
})
export class UserComponent {
  private userService = inject(UserService);
  
  users = toSignal(
    this.userService.getUsers(),
    { initialValue: [] }
  );
}
```

### 4. **Component chi tiết** (`user-detail.component.ts`)

```typescript
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <button routerLink="/users">← Quay lại</button>
      
      <div *ngIf="user()">
        <h1>{{ user()!.name }}</h1>
        <p>Email: {{ user()!.email }}</p>
        <p>Phone: {{ user()!.phone }}</p>
        
        <!-- Debug info -->
        <div class="debug">
          <p>User ID từ URL: {{ userId() }}</p>
          <p>User ID từ data: {{ user()!.id }}</p>
        </div>
      </div>
      
      <div *ngIf="!user() && !isLoading()">
        User không tồn tại!
      </div>
    </div>
  `
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  // 🎯 BƯỚC 1: Lấy userId từ URL params
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );

  // 🎯 BƯỚC 2: Tự động fetch user data khi userId thay đổi
  user = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),           // Lấy id từ URL
      switchMap(id => 
        this.userService.getUserById(Number(id)) // Fetch data từ API
      )
    ),
    { initialValue: null }
  );

  // 🎯 BƯỚC 3: Computed signal để check loading state
  isLoading = computed(() => 
    this.userId() !== null && this.user() === null
  );
}
```

---

## So sánh các cách lấy params

| Phương pháp | Reactive | Auto Update | Unsubscribe | Độ phức tạp | Khuyến nghị |
|-------------|----------|-------------|-------------|-------------|-------------|
| `toSignal()` | ✅ | ✅ | ✅ Auto | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| `subscribe()` | ✅ | ✅ | ❌ Manual | ⭐⭐⭐ | ⭐⭐⭐ |
| `snapshot` | ❌ | ❌ | N/A | ⭐ | ⭐⭐ |

---

## Best Practices

### ✅ DO - Nên làm

1. **Sử dụng `toSignal()` với Angular 16+**
```typescript
userId = toSignal(
  this.route.paramMap.pipe(map(params => params.get('id'))),
  { initialValue: null }
);
```

2. **Validate params trước khi sử dụng**
```typescript
user = toSignal(
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    map(id => {
      const numId = Number(id);
      if (isNaN(numId) || numId <= 0) {
        throw new Error('Invalid user ID');
      }
      return numId;
    }),
    switchMap(id => this.userService.getUserById(id))
  )
);
```

3. **Xử lý error cases**
```typescript
user = toSignal(
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => this.userService.getUserById(Number(id))),
    catchError(error => {
      console.error('Error loading user:', error);
      return of(null);
    })
  ),
  { initialValue: null }
);
```

4. **Sử dụng `inject()` thay vì constructor injection**
```typescript
// ✅ Modern way
private route = inject(ActivatedRoute);

// ❌ Old way (có thể gây lỗi với signals)
constructor(private route: ActivatedRoute) {}
```

### ❌ DON'T - Không nên làm

1. **Không dùng snapshot khi params có thể thay đổi**
```typescript
// ❌ BAD: Không update khi navigate từ /users/1 → /users/2
ngOnInit() {
  this.userId = this.route.snapshot.paramMap.get('id');
}
```

2. **Không quên unsubscribe với subscribe()**
```typescript
// ❌ BAD: Memory leak!
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.userId = params.get('id');
  });
  // Thiếu unsubscribe!
}
```

3. **Không hardcode params trong route**
```typescript
// ❌ BAD
[routerLink]="'/users/' + user.id"

// ✅ GOOD
[routerLink]="['/users', user.id]"
```

---

## 🎓 Tóm tắt

### Router Params cho phép:
1. ✅ Tạo **dynamic routes** với 1 component
2. ✅ Truyền dữ liệu qua URL
3. ✅ Tạo deep links có thể bookmark
4. ✅ SEO friendly URLs

### Quy trình hoàn chỉnh:
```
1. Định nghĩa route với :param
   ↓
2. Navigate với [routerLink]="['/path', value]"
   ↓
3. Lấy param với toSignal(route.paramMap)
   ↓
4. Sử dụng param để fetch data
   ↓
5. Hiển thị data trong template
```

### Key takeaways:
- 🎯 Dùng `toSignal()` cho modern Angular
- 🎯 Dùng `switchMap()` để fetch data dựa trên params
- 🎯 Luôn validate params
- 🎯 Xử lý error và loading states

---

## 📖 Tài liệu tham khảo

- [Angular Router Documentation](https://angular.dev/guide/routing)
- [ActivatedRoute API](https://angular.dev/api/router/ActivatedRoute)
- [RxJS Operators](https://rxjs.dev/api)
- [Angular Signals](https://angular.dev/guide/signals)

---

**Tác giả:** Antigravity AI  
**Ngày tạo:** 2025-12-15  
**Dự án:** tuhoc2 - Angular Router Params Demo
