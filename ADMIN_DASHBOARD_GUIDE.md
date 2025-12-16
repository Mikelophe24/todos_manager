# 👥 Admin Dashboard - Technical Guide

## 📖 Tổng quan

Admin Dashboard là một ví dụ hoàn hảo về **"UI State Heaven"** - quản lý state phức tạp với nhiều derived state sử dụng Angular Signals. Dashboard này cung cấp đầy đủ tính năng quản lý users với:

- ✅ **Row Selection** (single & bulk)
- ✅ **Advanced Filters** với active chips
- ✅ **Search** real-time
- ✅ **Sort** đa chiều
- ✅ **Pagination** đầy đủ
- ✅ **Bulk Actions** (delete, email, export CSV, update status)
- ✅ **Statistics Dashboard** real-time

---

## 🏗️ Kiến trúc State Management

### 📊 STATE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    BASE SIGNALS (Writable)                   │
├─────────────────────────────────────────────────────────────┤
│ • rows          - Tất cả user data                          │
│ • selectedIds   - Set<number> các ID đã chọn               │
│ • search        - Search query string                       │
│ • filters       - { role, status, department }             │
│ • sort          - { field, direction }                      │
│ • page          - Current page number                       │
│ • pageSize      - Items per page                           │
│ • loading       - Loading state                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 COMPUTED SIGNALS (Derived)                   │
├─────────────────────────────────────────────────────────────┤
│ • filteredRows           - Filtered by search + filters     │
│ • sortedRows             - Sorted filtered rows             │
│ • visibleRows            - Paged sorted rows                │
│ • selectedRows           - Full objects of selected IDs     │
│ • isAllVisibleSelected   - Boolean check                    │
│ • selectedCount          - Number of selected               │
│ • totalPages             - Total page count                 │
│ • stats                  - Dashboard statistics             │
│ • activeFilterChips      - Active filter chips array        │
│ • availableRoles         - Dynamic role options             │
│ • availableStatuses      - Dynamic status options           │
│ • availableDepartments   - Dynamic department options       │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 DATA FLOW

```
rows (15 users)
    ↓
    ├─ search: "john"
    ├─ filters: { role: "Developer", status: "Active" }
    ↓
filteredRows (3 users matching criteria)
    ↓
    ├─ sort: { field: "name", direction: "asc" }
    ↓
sortedRows (3 users sorted)
    ↓
    ├─ page: 1, pageSize: 10
    ↓
visibleRows (3 users on current page)
    ↓
UI Display
```

---

## 📝 Base Signals (Writable State)

### 1. **rows** - User Data

```typescript
private readonly _rows = signal<AdminUser[]>([]);
readonly rows = this._rows.asReadonly();
```

**Mục đích**: Lưu trữ toàn bộ user data
**Type**: `AdminUser[]`
**Mutations**: `loadData()`, `bulkDelete()`, `bulkUpdateStatus()`

### 2. **selectedIds** - Selection State

```typescript
private readonly _selectedIds = signal<Set<number>>(new Set());
readonly selectedIds = this._selectedIds.asReadonly();
```

**Mục đích**: Track các row đã được chọn
**Type**: `Set<number>` (O(1) lookup performance)
**Mutations**: `toggleRow()`, `selectAllVisible()`, `deselectAllVisible()`, `clearSelection()`

**Tại sao dùng Set?**
- O(1) cho `.has()`, `.add()`, `.delete()`
- Tự động deduplicate
- Memory efficient

### 3. **search** - Search Query

```typescript
private readonly _search = signal<string>('');
readonly search = this._search.asReadonly();
```

**Mục đích**: Lưu search query
**Mutations**: `setSearch()`
**Side effects**: Reset page về 1, clear selection

### 4. **filters** - Filter State

```typescript
private readonly _filters = signal<AdminFilters>({
  role: 'all',
  status: 'all',
  department: 'all'
});
readonly filters = this._filters.asReadonly();
```

**Mục đích**: Lưu trạng thái filters
**Mutations**: `setFilter()`, `removeFilterChip()`, `resetFilters()`
**Side effects**: Reset page về 1, clear selection

### 5. **sort** - Sort State

```typescript
private readonly _sort = signal<AdminSortOptions>({
  field: 'name',
  direction: 'asc'
});
readonly sort = this._sort.asReadonly();
```

**Mục đích**: Lưu sort configuration
**Mutations**: `setSort()`
**Smart toggle**: Click cùng field → toggle direction

### 6. **page & pageSize** - Pagination State

```typescript
private readonly _page = signal<number>(1);
private readonly _pageSize = signal<number>(10);
```

**Mục đích**: Quản lý pagination
**Mutations**: `setPage()`, `setPageSize()`, `nextPage()`, `previousPage()`

---

## 🧮 Computed Signals (Derived State)

### 1. **filteredRows** - Filtered Data

```typescript
readonly filteredRows = computed(() => {
  const rows = this._rows();
  const search = this._search().toLowerCase().trim();
  const filters = this._filters();
  
  return rows.filter(user => {
    // Search filter (name OR email)
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);
    
    // Role filter
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    
    // Status filter
    const matchesStatus = filters.status === 'all' || user.status === filters.status;
    
    // Department filter
    const matchesDepartment = filters.department === 'all' || user.department === filters.department;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });
});
```

**Dependencies**: `_rows`, `_search`, `_filters`
**Re-computes when**: Bất kỳ dependency nào thay đổi
**Performance**: O(n) where n = total rows

### 2. **sortedRows** - Sorted Data

```typescript
readonly sortedRows = computed(() => {
  const rows = [...this.filteredRows()]; // Clone để không mutate
  const sortOpts = this._sort();
  
  return rows.sort((a, b) => {
    let aValue: any = a[sortOpts.field];
    let bValue: any = b[sortOpts.field];
    
    // Handle Date objects
    if (aValue instanceof Date) aValue = aValue.getTime();
    if (bValue instanceof Date) bValue = bValue.getTime();
    
    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;
    
    return sortOpts.direction === 'asc' ? comparison : -comparison;
  });
});
```

**Dependencies**: `filteredRows`, `_sort`
**Re-computes when**: Filtered data hoặc sort options thay đổi
**Performance**: O(n log n) where n = filtered rows
**Note**: Clone array trước khi sort để tránh mutate

### 3. **visibleRows** - Paged Data

```typescript
readonly visibleRows = computed(() => {
  const rows = this.sortedRows();
  const page = this._page();
  const pageSize = this._pageSize();
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return rows.slice(startIndex, endIndex);
});
```

**Dependencies**: `sortedRows`, `_page`, `_pageSize`
**Re-computes when**: Sorted data hoặc pagination thay đổi
**Performance**: O(1) - chỉ slice array

### 4. **selectedRows** - Selected Data Objects

```typescript
readonly selectedRows = computed(() => {
  const selectedIds = this._selectedIds();
  const allRows = this._rows();
  
  return allRows.filter(row => selectedIds.has(row.id));
});
```

**Dependencies**: `_selectedIds`, `_rows`
**Use case**: Export CSV, bulk actions cần full data
**Performance**: O(n) where n = total rows

### 5. **isAllVisibleSelected** - Select All State

```typescript
readonly isAllVisibleSelected = computed(() => {
  const visible = this.visibleRows();
  const selectedIds = this._selectedIds();
  
  if (visible.length === 0) return false;
  
  return visible.every(row => selectedIds.has(row.id));
});
```

**Dependencies**: `visibleRows`, `_selectedIds`
**Use case**: Checkbox "Select All" state
**Performance**: O(n) where n = visible rows (thường ≤ 50)

### 6. **selectedCount** - Selection Count

```typescript
readonly selectedCount = computed(() => {
  return this._selectedIds().size;
});
```

**Dependencies**: `_selectedIds`
**Use case**: Display "X selected" badge
**Performance**: O(1)

### 7. **totalPages** - Total Page Count

```typescript
readonly totalPages = computed(() => {
  const totalItems = this.filteredRows().length;
  const pageSize = this._pageSize();
  return Math.ceil(totalItems / pageSize) || 1;
});
```

**Dependencies**: `filteredRows`, `_pageSize`
**Use case**: Pagination controls
**Performance**: O(1)

### 8. **stats** - Dashboard Statistics

```typescript
readonly stats = computed((): DashboardStats => {
  const allRows = this._rows();
  const filteredRows = this.filteredRows();
  
  return {
    totalUsers: allRows.length,
    activeUsers: allRows.filter(u => u.status === 'Active').length,
    pendingUsers: allRows.filter(u => u.status === 'Pending').length,
    suspendedUsers: allRows.filter(u => u.status === 'Suspended').length,
    selectedCount: this.selectedCount(),
    filteredCount: filteredRows.length
  };
});
```

**Dependencies**: `_rows`, `filteredRows`, `selectedCount`
**Use case**: Statistics cards ở header
**Performance**: O(n) where n = total rows

### 9. **activeFilterChips** - Active Filter Chips

```typescript
readonly activeFilterChips = computed(() => {
  const filters = this._filters();
  const chips: Array<{ label: string; value: string; key: keyof AdminFilters }> = [];
  
  if (filters.role !== 'all') {
    chips.push({ label: 'Role', value: filters.role, key: 'role' });
  }
  if (filters.status !== 'all') {
    chips.push({ label: 'Status', value: filters.status, key: 'status' });
  }
  if (filters.department !== 'all') {
    chips.push({ label: 'Department', value: filters.department, key: 'department' });
  }
  
  return chips;
});
```

**Dependencies**: `_filters`
**Use case**: Hiển thị active filters dưới dạng removable chips
**Performance**: O(1)

### 10. **availableRoles/Statuses/Departments** - Dynamic Options

```typescript
readonly availableRoles = computed(() => {
  const rows = this._rows();
  const roles = new Set(rows.map(r => r.role));
  return ['all' as const, ...Array.from(roles).sort()];
});
```

**Dependencies**: `_rows`
**Use case**: Populate filter dropdowns dynamically
**Performance**: O(n) where n = total rows
**Benefit**: Options tự động update khi data thay đổi

---

## 🔧 Methods (State Mutations)

### Selection Methods

#### toggleRow(id: number)
```typescript
toggleRow(id: number): void {
  this._selectedIds.update(current => {
    const newSet = new Set(current);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return newSet;
  });
}
```

**Use case**: Click checkbox trên row
**Immutability**: Tạo new Set, không mutate current

#### selectAllVisible()
```typescript
selectAllVisible(): void {
  const visible = this.visibleRows();
  this._selectedIds.update(current => {
    const newSet = new Set(current);
    visible.forEach(row => newSet.add(row.id));
    return newSet;
  });
}
```

**Use case**: Click "Select All" checkbox
**Note**: Chỉ select visible rows, không phải all rows

#### toggleAllVisible()
```typescript
toggleAllVisible(): void {
  if (this.isAllVisibleSelected()) {
    this.deselectAllVisible();
  } else {
    this.selectAllVisible();
  }
}
```

**Use case**: Smart toggle cho "Select All" checkbox

### Bulk Actions

#### bulkDelete()
```typescript
bulkDelete(): void {
  const selectedIds = this._selectedIds();
  
  if (selectedIds.size === 0) {
    alert('No rows selected');
    return;
  }
  
  if (confirm(`Delete ${selectedIds.size} selected user(s)?`)) {
    this._rows.update(current => 
      current.filter(row => !selectedIds.has(row.id))
    );
    this.clearSelection();
  }
}
```

**Use case**: Xóa nhiều users cùng lúc
**Safety**: Confirm dialog trước khi xóa
**Side effect**: Clear selection sau khi xóa

#### exportCsv()
```typescript
exportCsv(): void {
  const rows = this.selectedCount() > 0 
    ? this.selectedRows() 
    : this.filteredRows();
  
  if (rows.length === 0) {
    alert('No data to export');
    return;
  }
  
  // CSV headers
  const headers = ['ID', 'Name', 'Email', 'Role', 'Status', ...];
  
  // CSV rows
  const csvRows = rows.map(user => [
    user.id,
    user.name,
    user.email,
    // ...
  ]);
  
  // Combine & download
  const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
```

**Use case**: Export selected hoặc filtered users ra CSV
**Smart**: Export selected nếu có, otherwise export filtered

#### bulkUpdateStatus(status: UserStatus)
```typescript
bulkUpdateStatus(status: UserStatus): void {
  const selectedIds = this._selectedIds();
  
  if (selectedIds.size === 0) {
    alert('No users selected');
    return;
  }
  
  this._rows.update(current => 
    current.map(row => 
      selectedIds.has(row.id) ? { ...row, status } : row
    )
  );
  
  this.clearSelection();
}
```

**Use case**: Update status của nhiều users cùng lúc
**Immutability**: Tạo new objects, không mutate

---

## 🎯 Component Design

Component rất lightweight vì tất cả logic ở service:

```typescript
export class AdminDashboardComponent implements OnInit {
  protected readonly adminService = inject(AdminService);
  
  // UI state (local, không cần signals)
  protected searchQuery = '';
  protected selectedRole = 'all';
  protected selectedStatus = 'all';
  protected selectedDepartment = 'all';
  protected showBulkActions = false;
  
  ngOnInit(): void {
    this.adminService.loadData();
  }
  
  // Simple event handlers
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.adminService.setSearch(query);
  }
  
  onToggleRow(id: number): void {
    this.adminService.toggleRow(id);
  }
  
  // ... more handlers
}
```

**Separation of Concerns**:
- Component: UI events → Service methods
- Service: State management + business logic
- Template: Display computed values

---

## 📊 Performance Optimization

### 1. **Memoization**
Tất cả computed signals tự động memoize:

```typescript
// Chỉ re-compute khi dependencies thay đổi
readonly filteredRows = computed(() => {
  // Expensive filtering logic
});
```

### 2. **Granular Dependencies**
Mỗi computed chỉ depend on những gì cần:

```typescript
// visibleRows chỉ depend on sortedRows, page, pageSize
// KHÔNG depend on search, filters
readonly visibleRows = computed(() => {
  const rows = this.sortedRows();
  const page = this._page();
  const pageSize = this._pageSize();
  return rows.slice(startIndex, endIndex);
});
```

### 3. **Set for Selection**
Dùng Set thay vì Array cho O(1) lookup:

```typescript
// ✅ Good - O(1)
selectedIds.has(id)

// ❌ Bad - O(n)
selectedIds.includes(id)
```

### 4. **Immutability**
Clone trước khi mutate để tránh side effects:

```typescript
// ✅ Good
const rows = [...this.filteredRows()];
return rows.sort(...);

// ❌ Bad
return this.filteredRows().sort(...); // Mutates original!
```

---

## 🎨 UI Features

### 1. **Statistics Cards**
Real-time stats tự động update:

```html
<div class="stat-value">{{ adminService.stats().totalUsers }}</div>
<div class="stat-value">{{ adminService.stats().activeUsers }}</div>
```

### 2. **Filter Chips**
Active filters hiển thị dưới dạng removable chips:

```html
@for (chip of adminService.activeFilterChips(); track chip.key) {
  <div class="filter-chip">
    <span>{{ chip.label }}: {{ chip.value }}</span>
    <button (click)="onRemoveChip(chip.key)">✕</button>
  </div>
}
```

### 3. **Row Selection**
Visual feedback cho selected rows:

```html
<tr [class.row-selected]="isRowSelected(user.id)">
  <td>
    <input type="checkbox" 
           [checked]="isRowSelected(user.id)"
           (change)="onToggleRow(user.id)" />
  </td>
</tr>
```

### 4. **Bulk Actions**
Conditional rendering dựa trên selection:

```html
@if (adminService.selectedCount() > 0) {
  <div class="bulk-actions">
    <button (click)="onBulkDelete()">🗑️ Delete</button>
    <button (click)="onBulkEmail()">📧 Email</button>
  </div>
}
```

---

## 🧪 Testing Strategy

### Service Tests

```typescript
describe('AdminService', () => {
  let service: AdminService;
  
  beforeEach(() => {
    service = new AdminService();
    service.loadData();
  });
  
  it('should filter by search query', () => {
    service.setSearch('john');
    const filtered = service.filteredRows();
    expect(filtered.every(u => 
      u.name.toLowerCase().includes('john') ||
      u.email.toLowerCase().includes('john')
    )).toBe(true);
  });
  
  it('should select and deselect rows', () => {
    service.toggleRow(1);
    expect(service.selectedIds().has(1)).toBe(true);
    
    service.toggleRow(1);
    expect(service.selectedIds().has(1)).toBe(false);
  });
  
  it('should reset page when filtering', () => {
    service.setPage(3);
    service.setFilter({ role: 'Developer' });
    expect(service.page()).toBe(1);
  });
});
```

---

## 💡 Best Practices

### 1. **Private Base Signals**
```typescript
// ✅ Good
private readonly _rows = signal<AdminUser[]>([]);
readonly rows = this._rows.asReadonly();

// ❌ Bad
readonly rows = signal<AdminUser[]>([]); // Anyone can mutate!
```

### 2. **Immutable Updates**
```typescript
// ✅ Good
this._filters.update(current => ({ ...current, ...filters }));

// ❌ Bad
const current = this._filters();
current.role = 'Admin'; // Mutating!
this._filters.set(current);
```

### 3. **Clear Selection on Filter**
```typescript
setFilter(filters: Partial<AdminFilters>): void {
  this._filters.update(current => ({ ...current, ...filters }));
  this._page.set(1);
  this.clearSelection(); // ← Important!
}
```

### 4. **Smart Defaults**
```typescript
// Export selected nếu có, otherwise filtered
const rows = this.selectedCount() > 0 
  ? this.selectedRows() 
  : this.filteredRows();
```

---

## 🚀 Future Enhancements

1. **Server-side Pagination**
   - API integration
   - Virtual scrolling

2. **Advanced Filters**
   - Date range picker
   - Multi-select filters
   - Custom filter builder

3. **Persistence**
   - Save filters to localStorage
   - Save sort preferences
   - Restore state on reload

4. **Real-time Updates**
   - WebSocket integration
   - Auto-refresh
   - Optimistic updates

5. **Export Options**
   - Export to Excel
   - Export to PDF
   - Custom column selection

---

## 📚 Related Patterns

- **Signal Store Pattern** - State management với signals
- **Computed Signals** - Derived state
- **Immutable Updates** - State mutations
- **Smart Defaults** - User-friendly behaviors

---

**Chúc bạn code tốt! 👥✨**
