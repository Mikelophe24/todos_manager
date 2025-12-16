import { Injectable, signal, computed } from '@angular/core';
import { 
  AdminUser, 
  AdminFilters, 
  AdminSortOptions, 
  AdminSortField, 
  SortDirection,
  UserRole,
  UserStatus,
  DashboardStats
} from '../models/admin-user';

/**
 * 👥 Admin Service - "UI State Heaven"
 * 
 * Service quản lý admin dashboard với UI state phức tạp:
 * - Row selection (single & bulk)
 * - Filters với active chips
 * - Search, Sort, Pagination
 * - Bulk actions (delete, export)
 * 
 * 📊 STATE ARCHITECTURE:
 * - Base Signals: rows, selectedIds, filters, sort, search, page, pageSize
 * - Computed Signals: visibleRows, selectedRows, isAllSelected, selectedCount, stats
 * 
 * 🔄 DATA FLOW:
 * rows → filtered → sorted → paged → visibleRows
 *   ↑        ↑         ↑        ↑
 * data   search/    sort     page/
 *        filters            pageSize
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  // ============================================
  // 📝 BASE SIGNALS (Writable State)
  // ============================================
  
  /**
   * 👥 All user rows
   */
  private readonly _rows = signal<AdminUser[]>([]);
  readonly rows = this._rows.asReadonly();
  
  /**
   * ✅ Selected row IDs (Set for O(1) lookup)
   */
  private readonly _selectedIds = signal<Set<number>>(new Set());
  readonly selectedIds = this._selectedIds.asReadonly();
  
  /**
   * 🔍 Search query
   */
  private readonly _search = signal<string>('');
  readonly search = this._search.asReadonly();
  
  /**
   * 🎯 Filters
   */
  private readonly _filters = signal<AdminFilters>({
    role: 'all',
    status: 'all',
    department: 'all'
  });
  readonly filters = this._filters.asReadonly();
  
  /**
   * 📊 Sort options
   */
  private readonly _sort = signal<AdminSortOptions>({
    field: 'name',
    direction: 'asc'
  });
  readonly sort = this._sort.asReadonly();
  
  /**
   * 📄 Pagination
   */
  private readonly _page = signal<number>(1);
  readonly page = this._page.asReadonly();
  
  private readonly _pageSize = signal<number>(10);
  readonly pageSize = this._pageSize.asReadonly();
  
  /**
   * ⏳ Loading state
   */
  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();
  
  // ============================================
  // 🧮 COMPUTED SIGNALS (Derived State)
  // ============================================
  
  /**
   * 🔍 Filtered rows (by search + filters)
   */
  readonly filteredRows = computed(() => {
    const rows = this._rows();
    const search = this._search().toLowerCase().trim();
    const filters = this._filters();
    
    return rows.filter(user => {
      // Search filter (name or email)
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
  
  /**
   * 📊 Sorted rows
   */
  readonly sortedRows = computed(() => {
    const rows = [...this.filteredRows()];
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
  
  /**
   * 📄 Visible rows (paged)
   */
  readonly visibleRows = computed(() => {
    const rows = this.sortedRows();
    const page = this._page();
    const pageSize = this._pageSize();
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return rows.slice(startIndex, endIndex);
  });
  
  /**
   * ✅ Selected rows (full objects)
   */
  readonly selectedRows = computed(() => {
    const selectedIds = this._selectedIds();
    const allRows = this._rows();
    
    return allRows.filter(row => selectedIds.has(row.id));
  });
  
  /**
   * 🎯 Is all visible rows selected?
   */
  readonly isAllVisibleSelected = computed(() => {
    const visible = this.visibleRows();
    const selectedIds = this._selectedIds();
    
    if (visible.length === 0) return false;
    
    return visible.every(row => selectedIds.has(row.id));
  });
  
  /**
   * 🔢 Selected count
   */
  readonly selectedCount = computed(() => {
    return this._selectedIds().size;
  });
  
  /**
   * 📊 Total pages
   */
  readonly totalPages = computed(() => {
    const totalItems = this.filteredRows().length;
    const pageSize = this._pageSize();
    return Math.ceil(totalItems / pageSize) || 1;
  });
  
  /**
   * 📈 Dashboard statistics
   */
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
  
  /**
   * 🏷️ Active filter chips
   */
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
  
  /**
   * 🎨 Available filter options (computed from data)
   */
  readonly availableRoles = computed(() => {
    const rows = this._rows();
    const roles = new Set(rows.map(r => r.role));
    return ['all' as const, ...Array.from(roles).sort()];
  });
  
  readonly availableStatuses = computed(() => {
    const rows = this._rows();
    const statuses = new Set(rows.map(r => r.status));
    return ['all' as const, ...Array.from(statuses).sort()];
  });
  
  readonly availableDepartments = computed(() => {
    const rows = this._rows();
    const departments = new Set(rows.map(r => r.department));
    return ['all' as const, ...Array.from(departments).sort()];
  });
  
  // ============================================
  // 🔧 METHODS (State Mutations)
  // ============================================
  
  /**
   * 📥 Load data
   */
  loadData(): void {
    this._loading.set(true);
    
    setTimeout(() => {
      this._rows.set(MOCK_ADMIN_USERS);
      this._loading.set(false);
    }, 500);
  }
  
  /**
   * 🔍 Set search query
   */
  setSearch(query: string): void {
    this._search.set(query);
    this._page.set(1);
    this.clearSelection(); // Clear selection when searching
  }
  
  /**
   * 🎯 Set filter
   */
  setFilter(filters: Partial<AdminFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
    this._page.set(1);
    this.clearSelection();
  }
  
  /**
   * 🗑️ Remove filter chip
   */
  removeFilterChip(key: keyof AdminFilters): void {
    this._filters.update(current => ({ ...current, [key]: 'all' }));
    this._page.set(1);
  }
  
  /**
   * 🔄 Reset all filters
   */
  resetFilters(): void {
    this._filters.set({
      role: 'all',
      status: 'all',
      department: 'all'
    });
    this._search.set('');
    this._page.set(1);
    this.clearSelection();
  }
  
  /**
   * 📊 Set sort
   */
  setSort(field: AdminSortField, direction?: SortDirection): void {
    const currentSort = this._sort();
    
    const newDirection = direction || 
      (currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc');
    
    this._sort.set({ field, direction: newDirection });
  }
  
  /**
   * 📄 Set page
   */
  setPage(page: number): void {
    const totalPages = this.totalPages();
    if (page >= 1 && page <= totalPages) {
      this._page.set(page);
    }
  }
  
  /**
   * 📏 Set page size
   */
  setPageSize(size: number): void {
    this._pageSize.set(size);
    this._page.set(1);
  }
  
  // ============================================
  // ✅ SELECTION METHODS
  // ============================================
  
  /**
   * ✅ Toggle single row selection
   */
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
  
  /**
   * ✅ Select all visible rows
   */
  selectAllVisible(): void {
    const visible = this.visibleRows();
    this._selectedIds.update(current => {
      const newSet = new Set(current);
      visible.forEach(row => newSet.add(row.id));
      return newSet;
    });
  }
  
  /**
   * ❌ Deselect all visible rows
   */
  deselectAllVisible(): void {
    const visible = this.visibleRows();
    const visibleIds = new Set(visible.map(r => r.id));
    
    this._selectedIds.update(current => {
      const newSet = new Set(current);
      visibleIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  }
  
  /**
   * 🔄 Toggle all visible rows
   */
  toggleAllVisible(): void {
    if (this.isAllVisibleSelected()) {
      this.deselectAllVisible();
    } else {
      this.selectAllVisible();
    }
  }
  
  /**
   * 🧹 Clear all selection
   */
  clearSelection(): void {
    this._selectedIds.set(new Set());
  }
  
  // ============================================
  // 🎯 BULK ACTIONS
  // ============================================
  
  /**
   * 🗑️ Bulk delete selected rows
   */
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
  
  /**
   * 📊 Export selected rows to CSV
   */
  exportCsv(): void {
    const rows = this.selectedCount() > 0 
      ? this.selectedRows() 
      : this.filteredRows();
    
    if (rows.length === 0) {
      alert('No data to export');
      return;
    }
    
    // CSV headers
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Department', 'Joined Date', 'Last Active', 'Tasks Completed'];
    
    // CSV rows
    const csvRows = rows.map(user => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.status,
      user.department,
      user.joinedDate.toISOString().split('T')[0],
      user.lastActive.toISOString().split('T')[0],
      user.tasksCompleted
    ]);
    
    // Combine
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  /**
   * 📧 Bulk email (placeholder)
   */
  bulkEmail(): void {
    const count = this.selectedCount();
    if (count === 0) {
      alert('No users selected');
      return;
    }
    alert(`Send email to ${count} selected user(s)? (Feature not implemented)`);
  }
  
  /**
   * 🔄 Bulk update status (placeholder)
   */
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
}

// ============================================
// 🎭 MOCK DATA
// ============================================

const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    status: 'Active',
    department: 'Engineering',
    joinedDate: new Date('2022-01-15'),
    lastActive: new Date('2024-12-15'),
    tasksCompleted: 245
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Manager',
    status: 'Active',
    department: 'Product',
    joinedDate: new Date('2021-06-20'),
    lastActive: new Date('2024-12-14'),
    tasksCompleted: 189
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.j@company.com',
    role: 'Developer',
    status: 'Active',
    department: 'Engineering',
    joinedDate: new Date('2023-03-10'),
    lastActive: new Date('2024-12-16'),
    tasksCompleted: 156
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.w@company.com',
    role: 'Designer',
    status: 'Active',
    department: 'Design',
    joinedDate: new Date('2022-08-05'),
    lastActive: new Date('2024-12-15'),
    tasksCompleted: 203
  },
  {
    id: 5,
    name: 'Tom Brown',
    email: 'tom.brown@company.com',
    role: 'Developer',
    status: 'Inactive',
    department: 'Engineering',
    joinedDate: new Date('2020-11-12'),
    lastActive: new Date('2024-11-30'),
    tasksCompleted: 312
  },
  {
    id: 6,
    name: 'Emily Davis',
    email: 'emily.d@company.com',
    role: 'Manager',
    status: 'Active',
    department: 'Marketing',
    joinedDate: new Date('2021-04-18'),
    lastActive: new Date('2024-12-16'),
    tasksCompleted: 178
  },
  {
    id: 7,
    name: 'David Wilson',
    email: 'david.w@company.com',
    role: 'Developer',
    status: 'Pending',
    department: 'Engineering',
    joinedDate: new Date('2024-12-01'),
    lastActive: new Date('2024-12-10'),
    tasksCompleted: 12
  },
  {
    id: 8,
    name: 'Lisa Anderson',
    email: 'lisa.a@company.com',
    role: 'Designer',
    status: 'Active',
    department: 'Design',
    joinedDate: new Date('2023-02-14'),
    lastActive: new Date('2024-12-15'),
    tasksCompleted: 167
  },
  {
    id: 9,
    name: 'Robert Taylor',
    email: 'robert.t@company.com',
    role: 'Viewer',
    status: 'Active',
    department: 'Sales',
    joinedDate: new Date('2023-09-22'),
    lastActive: new Date('2024-12-14'),
    tasksCompleted: 89
  },
  {
    id: 10,
    name: 'Jennifer Martinez',
    email: 'jennifer.m@company.com',
    role: 'Manager',
    status: 'Suspended',
    department: 'HR',
    joinedDate: new Date('2021-07-30'),
    lastActive: new Date('2024-10-15'),
    tasksCompleted: 145
  },
  {
    id: 11,
    name: 'Chris Lee',
    email: 'chris.lee@company.com',
    role: 'Developer',
    status: 'Active',
    department: 'Engineering',
    joinedDate: new Date('2022-12-05'),
    lastActive: new Date('2024-12-16'),
    tasksCompleted: 198
  },
  {
    id: 12,
    name: 'Amanda White',
    email: 'amanda.w@company.com',
    role: 'Designer',
    status: 'Active',
    department: 'Design',
    joinedDate: new Date('2023-05-17'),
    lastActive: new Date('2024-12-15'),
    tasksCompleted: 134
  },
  {
    id: 13,
    name: 'Kevin Harris',
    email: 'kevin.h@company.com',
    role: 'Developer',
    status: 'Pending',
    department: 'Engineering',
    joinedDate: new Date('2024-11-20'),
    lastActive: new Date('2024-12-12'),
    tasksCompleted: 8
  },
  {
    id: 14,
    name: 'Michelle Clark',
    email: 'michelle.c@company.com',
    role: 'Manager',
    status: 'Active',
    department: 'Product',
    joinedDate: new Date('2020-09-08'),
    lastActive: new Date('2024-12-16'),
    tasksCompleted: 267
  },
  {
    id: 15,
    name: 'Daniel Lewis',
    email: 'daniel.l@company.com',
    role: 'Viewer',
    status: 'Inactive',
    department: 'Sales',
    joinedDate: new Date('2022-03-25'),
    lastActive: new Date('2024-09-20'),
    tasksCompleted: 76
  }
];
