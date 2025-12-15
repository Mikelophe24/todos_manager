# 🔄 Luồng Hoạt Động Todos Practice

## 📊 Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────┐
│                    TODOS COMPONENT                       │
├─────────────────────────────────────────────────────────┤
│  Signals (Reactive State)                               │
│  ├─ todos: signal<Todo[]>          [Tracked]            │
│  ├─ query: signal<string>          [Untracked in effect]│
│  └─ statusFilter: signal<Status>   [Untracked in effect]│
├─────────────────────────────────────────────────────────┤
│  Computed (Derived State)                               │
│  └─ filteredTodos = computed(() => ...)                 │
│     ├─ Depends on: todos()                              │
│     ├─ Depends on: query()                              │
│     └─ Depends on: statusFilter()                       │
├─────────────────────────────────────────────────────────┤
│  Effect (Side Effects)                                  │
│  └─ effect(() => ...)                                   │
│     ├─ Tracks: todos()                                  │
│     ├─ Untracked: query(), statusFilter()               │
│     └─ Action: Save to localStorage                     │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Luồng Hoạt Động Chính

### 1️⃣ **Khởi Tạo Component**
```
Component Constructor
    ↓
loadTodosFromLocalStorage()
    ↓
localStorage.getItem('angular_todos_practice_v2')
    ↓
Parse JSON → Convert dates → Set todos signal
    ↓
Update nextId counter
    ↓
Effect tự động chạy lần đầu
```

### 2️⃣ **Thêm Todo**
```
User nhập text → Enter/Click "Thêm"
    ↓
handleAddTodo()
    ↓
addTodo(text)
    ↓
todos.update(current => [...current, newTodo])
    ↓
Signal todos thay đổi
    ↓
    ├─→ filteredTodos computed tự động re-run
    │   └─→ UI cập nhật danh sách
    │
    └─→ Effect tự động chạy
        └─→ Save to localStorage
```

### 3️⃣ **Thay Đổi Status**
```
User chọn status từ dropdown
    ↓
updateTodoStatus(id, newStatus)
    ↓
todos.update(current => current.map(...))
    ↓
Signal todos thay đổi
    ↓
    ├─→ filteredTodos computed tự động re-run
    │   └─→ UI cập nhật (màu border, stats)
    │
    └─→ Effect tự động chạy
        └─→ Save to localStorage
```

### 4️⃣ **Xóa Todo**
```
User click nút 🗑️
    ↓
removeTodo(id)
    ↓
todos.update(current => current.filter(...))
    ↓
Signal todos thay đổi
    ↓
    ├─→ filteredTodos computed tự động re-run
    │   └─→ UI cập nhật danh sách
    │
    └─→ Effect tự động chạy
        └─→ Save to localStorage
```

### 5️⃣ **Tìm Kiếm**
```
User gõ vào search box
    ↓
query.set(searchText)
    ↓
Signal query thay đổi
    ↓
filteredTodos computed tự động re-run
    ├─ Lọc theo statusFilter
    └─ Lọc theo query
    ↓
UI cập nhật danh sách
    ↓
Effect KHÔNG chạy (vì query là untracked) ✅
```

### 6️⃣ **Lọc Theo Status**
```
User click nút filter (All/Pending/Progress/Complete)
    ↓
statusFilter.set(newStatus)
    ↓
Signal statusFilter thay đổi
    ↓
filteredTodos computed tự động re-run
    ├─ Lọc theo statusFilter
    └─ Lọc theo query
    ↓
UI cập nhật danh sách
    ↓
Effect KHÔNG chạy (vì statusFilter là untracked) ✅
```

## 🔑 Điểm Quan Trọng

### **Tracked vs Untracked**
```typescript
effect(() => {
  const currentTodos = this.todos();  // ✅ TRACKED
  // → Khi todos thay đổi → Effect chạy lại
  
  const currentQuery = untracked(() => this.query());  // ❌ UNTRACKED
  const currentStatus = untracked(() => this.statusFilter());  // ❌ UNTRACKED
  // → Khi query/status thay đổi → Effect KHÔNG chạy lại
  
  localStorage.setItem('...', JSON.stringify(currentTodos));
});
```

**Tại sao?**
- Chỉ muốn lưu localStorage khi **todos thực sự thay đổi** (thêm/xóa/update status)
- Không muốn lưu khi user chỉ **tìm kiếm** hoặc **lọc** (không thay đổi data)

### **Computed Dependencies**
```typescript
filteredTodos = computed(() => {
  const allTodos = this.todos();           // Dependency 1
  const searchQuery = this.query();        // Dependency 2
  const status = this.statusFilter();      // Dependency 3
  
  // Khi BẤT KỲ dependency nào thay đổi → Computed re-run
  return filtered;
});
```

## 📈 Sơ Đồ Data Flow

```
┌──────────────┐
│   UI Input   │
└──────┬───────┘
       │
       ▼
┌──────────────┐      ┌─────────────┐
│   Signals    │─────→│  Computed   │
│  (State)     │      │  (Derived)  │
└──────┬───────┘      └──────┬──────┘
       │                     │
       │                     ▼
       │              ┌─────────────┐
       │              │  Template   │
       │              │   (View)    │
       │              └─────────────┘
       │
       ▼
┌──────────────┐
│   Effect     │
│ (Side Effect)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ localStorage │
└──────────────┘
```

## 🎯 Ví Dụ Cụ Thể

### Scenario 1: Thêm Todo
```
1. User gõ "Học Angular Signals" → Enter
2. todos.update() → Thêm todo mới với status "Pending"
3. filteredTodos computed → Re-run → Bao gồm todo mới
4. UI → Hiển thị todo mới với border màu cam
5. Effect → Chạy → Lưu vào localStorage
6. Stats → Cập nhật: Pending +1, Total +1
```

### Scenario 2: Tìm Kiếm
```
1. User gõ "Angular" vào search box
2. query.set("Angular")
3. filteredTodos computed → Re-run → Chỉ hiển thị todos có "Angular"
4. UI → Cập nhật danh sách
5. Effect → KHÔNG chạy (query là untracked)
6. Stats → Vẫn hiển thị tổng số (không đổi)
```

### Scenario 3: Thay Đổi Status
```
1. User chọn "In Progress" cho todo
2. updateTodoStatus() → todos.update() → Map và thay đổi status
3. filteredTodos computed → Re-run
4. UI → Border đổi sang màu xanh dương
5. Effect → Chạy → Lưu vào localStorage
6. Stats → Pending -1, In Progress +1
```

## 💡 Tóm Tắt Siêu Ngắn

```
THÊM/XÓA/UPDATE STATUS
→ todos signal thay đổi
→ Computed re-run + Effect chạy
→ UI update + Save localStorage

TÌM KIẾM/LỌC STATUS
→ query/statusFilter signal thay đổi
→ Computed re-run
→ UI update
→ Effect KHÔNG chạy (untracked)
```

---

**Key Takeaway:** 
- **Signals** = Reactive state
- **Computed** = Auto-calculated từ signals
- **Effect** = Side effects (localStorage, API, logging)
- **Untracked** = Đọc signal mà không tạo dependency
