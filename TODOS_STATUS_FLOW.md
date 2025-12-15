# 🎯 Luồng Hoạt Động Status Todos - Chi Tiết

## 📊 Tổng Quan Status System

### **3 Trạng Thái (Status)**
```typescript
type TodoStatus = 'Pending' | 'In Progress' | 'Complete';

⏳ Pending      → Chưa bắt đầu (Màu cam #ffa726)
🔄 In Progress  → Đang làm (Màu xanh dương #42a5f5)
✅ Complete     → Hoàn thành (Màu xanh lá #66bb6a)
```

### **4 Bộ Lọc (Status Filter)**
```typescript
type StatusFilter = 'All' | 'Pending' | 'In Progress' | 'Complete';

📋 All          → Hiển thị tất cả
⏳ Pending      → Chỉ hiển thị Pending
🔄 In Progress  → Chỉ hiển thị In Progress
✅ Complete     → Chỉ hiển thị Complete
```

## 🔄 Luồng 1: THÊM TODO MỚI

### **Bước 1: User Thêm Todo**
```
User nhập: "Học Angular Signals"
    ↓
Click "➕ Thêm" hoặc Enter
    ↓
handleAddTodo() được gọi
```

### **Bước 2: Tạo Todo Object**
```typescript
addTodo(text: string): void {
  this.todos.update(currentTodos => {
    const newTodo: Todo = {
      id: this.nextId++,           // Auto-increment ID
      text: text.trim(),            // "Học Angular Signals"
      status: 'Pending',            // ⏳ MẶC ĐỊNH LÀ PENDING
      createdAt: new Date()         // Timestamp hiện tại
    };
    return [...currentTodos, newTodo];
  });
}
```

### **Bước 3: Signal Thay Đổi**
```
todos signal được update
    ↓
Trigger 2 reactions:
    ├─→ Computed: filteredTodos
    └─→ Effect: localStorage
```

### **Bước 4: UI Cập Nhật**
```
Template tự động render:
┌─────────────────────────────────────────┐
│ 📝 Học Angular Signals                  │
│ ⏳ Pending ▼  🗑️                        │
│ [Border màu cam]                        │
└─────────────────────────────────────────┘

Stats cập nhật:
⏳ Pending: 3 → 4
📝 Total: 9 → 10
```

## 🔄 Luồng 2: THAY ĐỔI STATUS

### **Bước 1: User Chọn Status Mới**
```
User click dropdown trên todo
    ↓
Chọn: "🔄 In Progress"
    ↓
(ngModelChange)="updateTodoStatus(todo.id, $event)"
```

### **Bước 2: Update Status**
```typescript
updateTodoStatus(id: number, newStatus: string): void {
  this.todos.update(currentTodos => {
    return currentTodos.map(todo => 
      todo.id === id 
        ? { ...todo, status: newStatus as Todo['status'] }
        //    ^^^^^^ Tạo object mới với status mới
        : todo  // Giữ nguyên các todo khác
    );
  });
}
```

**Chi tiết:**
```typescript
// TRƯỚC:
{ id: 1, text: "Học Angular", status: "Pending", ... }

// SAU khi update:
{ id: 1, text: "Học Angular", status: "In Progress", ... }
//                                     ^^^^^^^^^^^^^^
//                                     Đã thay đổi!
```

### **Bước 3: Reactive Updates**
```
todos signal thay đổi
    ↓
    ├─→ filteredTodos computed re-run
    │   └─→ Kiểm tra lại filter
    │
    ├─→ Effect chạy
    │   └─→ Save to localStorage
    │
    └─→ Template re-render
        ├─→ Border color thay đổi (cam → xanh dương)
        ├─→ Dropdown hiển thị status mới
        └─→ Stats cập nhật
```

### **Bước 4: UI Visual Changes**
```
TRƯỚC:                          SAU:
┌─────────────────────┐        ┌─────────────────────┐
│ Học Angular         │        │ Học Angular         │
│ ⏳ Pending ▼  🗑️   │   →    │ 🔄 In Progress ▼ 🗑️│
│ [Border cam]        │        │ [Border xanh dương] │
└─────────────────────┘        └─────────────────────┘

Stats:
⏳ Pending: 4 → 3
🔄 In Progress: 2 → 3
```

## 🔄 Luồng 3: LỌC THEO STATUS

### **Bước 1: User Click Filter Button**
```
User click nút "🔄 In Progress"
    ↓
(click)="statusFilter.set('In Progress')"
    ↓
statusFilter signal = 'In Progress'
```

### **Bước 2: Computed Tự Động Re-run**
```typescript
filteredTodos = computed(() => {
  const allTodos = this.todos();           // [10 todos]
  const searchQuery = this.query();        // ""
  const status = this.statusFilter();      // "In Progress" ← MỚI!

  // BƯỚC 1: Lọc theo status
  let filtered = allTodos;
  if (status !== 'All') {
    filtered = filtered.filter(todo => todo.status === status);
    // Chỉ giữ lại todos có status = "In Progress"
  }

  // BƯỚC 2: Lọc theo search query (nếu có)
  if (searchQuery) {
    filtered = filtered.filter(todo => 
      todo.text.toLowerCase().includes(searchQuery)
    );
  }

  return filtered;  // [3 todos với status "In Progress"]
});
```

### **Bước 3: UI Cập Nhật**
```
Template chỉ hiển thị todos đã lọc:

TRƯỚC (All):                    SAU (In Progress):
┌─────────────────┐            ┌─────────────────┐
│ ⏳ Todo 1       │            │ 🔄 Todo 2       │
│ 🔄 Todo 2       │            │ 🔄 Todo 5       │
│ ✅ Todo 3       │            │ 🔄 Todo 8       │
│ ⏳ Todo 4       │            └─────────────────┘
│ 🔄 Todo 5       │            
│ ...             │            Tìm thấy: 3 / 10
└─────────────────┘
```

### **Bước 4: Effect KHÔNG Chạy**
```typescript
effect(() => {
  const currentTodos = this.todos();  // ✅ Tracked
  
  // ❌ Untracked - Không tạo dependency
  const currentStatusFilter = untracked(() => this.statusFilter());
  
  localStorage.setItem('...', JSON.stringify(currentTodos));
});
```

**Kết quả:**
- ✅ UI cập nhật (hiển thị filtered list)
- ❌ Effect KHÔNG chạy (vì statusFilter là untracked)
- ❌ localStorage KHÔNG được update (không cần thiết!)

## 🔄 Luồng 4: KẾT HỢP FILTER + SEARCH

### **Scenario: Lọc "In Progress" + Tìm "Angular"**

```typescript
// State:
statusFilter = signal('In Progress')
query = signal('Angular')

// Computed logic:
filteredTodos = computed(() => {
  const allTodos = this.todos();  // 10 todos
  
  // Step 1: Lọc theo status
  let filtered = allTodos.filter(t => t.status === 'In Progress');
  // → 3 todos
  
  // Step 2: Lọc theo search
  filtered = filtered.filter(t => t.text.includes('Angular'));
  // → 1 todo
  
  return filtered;  // [1 todo]
});
```

**Kết quả:**
```
Tất cả todos (10)
    ↓ Filter by status "In Progress"
3 todos
    ↓ Filter by search "Angular"
1 todo
    ↓
Hiển thị: "Học Angular Signals" (status: In Progress)
```

## 📊 Luồng 5: THỐNG KÊ (STATS)

### **Cách Tính Stats**
```typescript
getCountByStatus(status: StatusFilter): number {
  if (status === 'All') {
    return this.todos().length;  // Tổng số todos
  }
  return this.todos().filter(todo => todo.status === status).length;
}
```

### **Template Gọi Hàm**
```html
<div class="stat-card pending">
  <div class="stat-value">{{ getCountByStatus('Pending') }}</div>
</div>
```

### **Reactive Updates**
```
Khi todos thay đổi:
    ↓
Template re-render
    ↓
Gọi lại getCountByStatus() cho mỗi stat card
    ↓
Stats tự động cập nhật
```

**Ví dụ:**
```
Thêm 1 todo mới (status: Pending)
    ↓
todos signal thay đổi
    ↓
Template re-render
    ↓
getCountByStatus('Pending'): 3 → 4
getCountByStatus('All'): 9 → 10
```

## 🎨 Luồng 6: VISUAL STYLING

### **CSS Data Attribute**
```html
<div class="todo-item" [attr.data-status]="todo.status">
  <!-- data-status="Pending" hoặc "In Progress" hoặc "Complete" -->
</div>
```

### **CSS Styling**
```css
.todo-item[data-status="Pending"] {
  border-left-color: #ffa726;  /* Cam */
}

.todo-item[data-status="In Progress"] {
  border-left-color: #42a5f5;  /* Xanh dương */
}

.todo-item[data-status="Complete"] {
  border-left-color: #66bb6a;  /* Xanh lá */
}
```

### **Dropdown Styling**
```html
<select 
  class="status-select"
  [class]="'status-' + todo.status.toLowerCase().replace(' ', '-')"
>
  <!-- class="status-pending" hoặc "status-in-progress" -->
</select>
```

```css
.status-select.status-pending {
  color: #f57c00;
  border-color: #ffa726;
}

.status-select.status-in-progress {
  color: #1976d2;
  border-color: #42a5f5;
}
```

## 🔑 Điểm Quan Trọng

### **1. Immutable Updates**
```typescript
// ✅ ĐÚNG - Tạo object mới
updateTodoStatus(id, newStatus) {
  this.todos.update(current => 
    current.map(todo => 
      todo.id === id 
        ? { ...todo, status: newStatus }  // Object mới
        : todo
    )
  );
}

// ❌ SAI - Mutate object cũ
updateTodoStatus(id, newStatus) {
  this.todos.update(current => {
    const todo = current.find(t => t.id === id);
    todo.status = newStatus;  // Mutate!
    return current;
  });
}
```

### **2. Untracked trong Effect**
```typescript
effect(() => {
  const todos = this.todos();  // ✅ Tracked
  const status = untracked(() => this.statusFilter());  // ❌ Untracked
  
  // Chỉ save khi TODOS thay đổi, không phải khi FILTER thay đổi
  localStorage.setItem('...', JSON.stringify(todos));
});
```

### **3. Computed Dependencies**
```typescript
filteredTodos = computed(() => {
  // 3 dependencies:
  const todos = this.todos();           // 1
  const query = this.query();           // 2
  const status = this.statusFilter();   // 3
  
  // Khi BẤT KỲ dependency nào thay đổi → Re-run
});
```

## 📈 Sơ Đồ Tổng Hợp

```
┌─────────────────────────────────────────────────────────┐
│                    STATUS WORKFLOW                       │
└─────────────────────────────────────────────────────────┘

THÊM TODO
  User Input → addTodo() → todos.update()
    ↓
  New Todo { status: 'Pending' }
    ↓
  ├─→ Computed re-run → UI update
  ├─→ Effect run → Save localStorage
  └─→ Stats update → Pending +1

THAY ĐỔI STATUS
  User Select → updateTodoStatus() → todos.update()
    ↓
  Map & change status
    ↓
  ├─→ Computed re-run → UI update
  ├─→ Effect run → Save localStorage
  ├─→ Border color change
  └─→ Stats update → Old -1, New +1

LỌC THEO STATUS
  User Click → statusFilter.set()
    ↓
  statusFilter signal change
    ↓
  ├─→ Computed re-run → Filter todos
  ├─→ UI update → Show filtered list
  └─→ Effect NOT run (untracked) ✅

THỐNG KÊ
  todos change → Template re-render
    ↓
  Call getCountByStatus() for each status
    ↓
  Display updated counts
```

## 💡 Tóm Tắt Siêu Ngắn

```
STATUS LIFECYCLE:

1. Tạo mới → Pending (mặc định)
2. User update → In Progress hoặc Complete
3. Lọc → Hiển thị theo status filter
4. Stats → Tự động đếm từ todos array
5. Visual → Border color theo status
6. Save → Chỉ khi todos thay đổi (không phải filter)
```

---

**Key Points:**
- ✅ Mỗi todo có 1 status (Pending/In Progress/Complete)
- ✅ Status có thể thay đổi qua dropdown
- ✅ Filter không làm thay đổi data, chỉ thay đổi view
- ✅ Stats tự động tính từ todos array
- ✅ Effect chỉ chạy khi todos thay đổi, không phải filter
