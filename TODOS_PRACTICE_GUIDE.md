# 📝 Bài Tập Todos Practice - Angular Signals

## 🎯 Mục Tiêu Bài Tập

Bài tập này giúp bạn nắm vững các khái niệm cốt lõi của Angular Signals:
- `signal()` - Tạo reactive state
- `computed()` - Tạo derived state (state phụ thuộc)
- `effect()` - Thực hiện side effects
- `untracked()` - Đọc signal mà không tạo dependency
- `update()` - Cập nhật signal dựa trên giá trị hiện tại

## 📋 Yêu Cầu Bài Tập

### 1. Tạo Signal Todos
```typescript
todos = signal<string[]>([])
```
- Signal chứa mảng các todo items (string)
- Khởi tạo với mảng rỗng

### 2. Viết Hàm addTodo(text)
```typescript
addTodo(text: string): void {
  this.todos.update(currentTodos => {
    return [...currentTodos, text.trim()];
  });
}
```
**Giải thích:**
- Sử dụng `update()` để cập nhật signal
- `update()` nhận callback với giá trị hiện tại
- Trả về giá trị mới (immutable pattern)
- Spread operator `...` để tạo mảng mới

### 3. Viết Hàm removeTodo(index)
```typescript
removeTodo(index: number): void {
  this.todos.update(currentTodos => {
    return currentTodos.filter((_, i) => i !== index);
  });
}
```
**Giải thích:**
- Dùng `filter()` để loại bỏ phần tử tại index
- `_` là convention cho biến không sử dụng
- Trả về mảng mới không chứa phần tử bị xóa

### 4. Tạo Signal Query và Computed FilteredTodos
```typescript
query = signal<string>('');

filteredTodos = computed(() => {
  const allTodos = this.todos();
  const searchQuery = this.query().toLowerCase().trim();

  if (!searchQuery) {
    return allTodos;
  }

  return allTodos.filter(todo => 
    todo.toLowerCase().includes(searchQuery)
  );
});
```
**Giải thích:**
- `computed()` tự động tính toán lại khi dependencies thay đổi
- Dependencies: `todos()` và `query()`
- Khi `todos` hoặc `query` thay đổi → `filteredTodos` tự động cập nhật
- Case-insensitive search với `toLowerCase()`

### 5. Viết Effect Lưu LocalStorage
```typescript
effect(() => {
  // Tracked - effect sẽ chạy lại khi todos thay đổi
  const currentTodos = this.todos();
  
  // Untracked - đọc query nhưng không tạo dependency
  const currentQuery = untracked(() => this.query());
  
  // Lưu vào localStorage
  localStorage.setItem('angular_todos_practice', JSON.stringify(currentTodos));
  
  // Log để debug
  console.log('💾 Saved to localStorage:', {
    todosCount: currentTodos.length,
    currentQuery: currentQuery,
    timestamp: new Date().toLocaleTimeString()
  });
});
```

**Giải thích `untracked()`:**
- Effect chỉ chạy lại khi `todos` thay đổi
- `query` được đọc bằng `untracked()` → không tạo dependency
- Nếu không dùng `untracked()`, effect sẽ chạy cả khi `query` thay đổi
- Hữu ích khi bạn cần đọc giá trị nhưng không muốn trigger effect

## 🔍 So Sánh: Tracked vs Untracked

### Với Tracked (Không dùng untracked)
```typescript
effect(() => {
  const currentTodos = this.todos();      // ✅ Tracked
  const currentQuery = this.query();       // ✅ Tracked
  
  localStorage.setItem('todos', JSON.stringify(currentTodos));
});
```
**Kết quả:** Effect chạy khi `todos` HOẶC `query` thay đổi
- User gõ tìm kiếm → `query` thay đổi → Effect chạy → Lưu localStorage (không cần thiết!)

### Với Untracked (Đúng cách)
```typescript
effect(() => {
  const currentTodos = this.todos();                    // ✅ Tracked
  const currentQuery = untracked(() => this.query());   // ❌ Untracked
  
  localStorage.setItem('todos', JSON.stringify(currentTodos));
});
```
**Kết quả:** Effect chỉ chạy khi `todos` thay đổi
- User gõ tìm kiếm → `query` thay đổi → Effect KHÔNG chạy ✅
- User thêm/xóa todo → `todos` thay đổi → Effect chạy → Lưu localStorage ✅

## 🎨 Tính Năng Đã Implement

### 1. Thêm Todo
- Input field với Enter key support
- Button "Thêm" với gradient đẹp
- Validation: không thêm todo rỗng
- Auto clear input sau khi thêm

### 2. Xóa Todo
- Button xóa cho mỗi todo
- Smooth animation khi xóa
- Hover effect

### 3. Tìm Kiếm/Lọc
- Real-time search
- Case-insensitive
- Hiển thị số lượng kết quả
- Computed tự động update

### 4. LocalStorage Persistence
- Tự động lưu khi todos thay đổi
- Tự động load khi khởi tạo component
- Console log để debug
- Error handling

### 5. UI/UX
- Gradient backgrounds
- Smooth animations
- Hover effects
- Responsive design
- Empty state messages
- Debug information panel

## 🧪 Cách Test

### 1. Test Basic CRUD
```
✅ Thêm todo → Check console log "Saved to localStorage"
✅ Xóa todo → Check console log "Saved to localStorage"
✅ Refresh page → Todos vẫn còn (loaded from localStorage)
```

### 2. Test Computed
```
✅ Gõ vào search box → Danh sách tự động lọc
✅ Xóa search → Hiển thị lại tất cả
✅ Check "Tìm thấy: X / Y" cập nhật đúng
```

### 3. Test Untracked
```
✅ Gõ vào search box → Console KHÔNG log "Saved to localStorage"
✅ Thêm/xóa todo → Console log "Saved to localStorage"
✅ Check currentQuery trong log có giá trị đúng
```

## 📊 Console Log Mẫu

Khi thêm todo:
```
💾 Saved to localStorage: {
  todosCount: 3,
  currentQuery: "angular",
  timestamp: "14:20:45"
}
```

Khi gõ search (không có log vì dùng untracked) ✅

## 🎓 Kiến Thức Học Được

### 1. Signal Basics
- Tạo reactive state với `signal()`
- Đọc signal với `signal()`
- Cập nhật signal với `set()` và `update()`

### 2. Computed
- Tạo derived state
- Auto-tracking dependencies
- Lazy evaluation
- Memoization

### 3. Effect
- Side effects trong reactive system
- Auto-run khi dependencies thay đổi
- Cleanup và lifecycle

### 4. Untracked
- Đọc signal mà không tạo dependency
- Tối ưu performance
- Tránh infinite loops

### 5. Best Practices
- Immutable updates
- Type safety với TypeScript
- Error handling
- Separation of concerns

## 🚀 Cách Chạy

1. Navigate đến route:
```
http://localhost:4200/todos-practice
```

2. Hoặc click vào navigation menu:
```
📝 Todos Practice
```

## 💡 Tips

1. **Luôn dùng immutable updates:**
   ```typescript
   // ✅ Good
   this.todos.update(current => [...current, newItem]);
   
   // ❌ Bad
   this.todos.update(current => {
     current.push(newItem);
     return current;
   });
   ```

2. **Computed vs Effect:**
   - `computed()` → Tính toán giá trị mới
   - `effect()` → Side effects (API calls, localStorage, logging)

3. **Khi nào dùng untracked:**
   - Cần đọc giá trị nhưng không muốn tạo dependency
   - Logging/debugging trong effect
   - Tránh infinite loops

## 📚 Tài Liệu Tham Khảo

- [Angular Signals Official Docs](https://angular.dev/guide/signals)
- [Signals Deep Dive](https://angular.dev/guide/signals/overview)
- [Effect Best Practices](https://angular.dev/guide/signals/effects)

## ✨ Bonus Challenges

1. Thêm tính năng edit todo
2. Thêm checkbox để đánh dấu hoàn thành
3. Thêm filter: All / Active / Completed
4. Thêm sort theo alphabet
5. Thêm undo/redo functionality
6. Thêm drag & drop để sắp xếp

---

**Happy Coding! 🎉**
