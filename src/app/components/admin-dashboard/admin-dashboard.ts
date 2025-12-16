import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AdminSortField, UserStatus } from '../../models/admin-user';

/**
 * 👥 Admin Dashboard Component
 * 
 * Dashboard quản lý users với đầy đủ tính năng:
 * - 📊 Table với row selection
 * - 🔍 Search & Filters
 * - 🏷️ Filter chips
 * - ✅ Select All / Bulk actions
 * - 📄 Pagination
 * - 📈 Statistics cards
 * 
 * Component này consume các computed signals từ AdminService.
 * Tất cả UI state phức tạp được quản lý bởi signals.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  
  // 💉 Inject AdminService
  protected readonly adminService = inject(AdminService);
  
  // 🎨 UI State
  protected searchQuery = '';
  protected selectedRole = 'all';
  protected selectedStatus = 'all';
  protected selectedDepartment = 'all';
  protected showBulkActions = false;
  
  // 📊 Sort field options
  protected readonly sortFields: { value: AdminSortField; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'status', label: 'Status' },
    { value: 'joinedDate', label: 'Joined Date' },
    { value: 'lastActive', label: 'Last Active' },
    { value: 'tasksCompleted', label: 'Tasks' }
  ];
  
  // 📏 Page size options
  protected readonly pageSizeOptions = [5, 10, 20, 50];
  
  // 🎭 Status options for bulk update
  protected readonly statusOptions: UserStatus[] = ['Active', 'Inactive', 'Pending', 'Suspended'];
  
  // 🔢 Expose Math for template
  protected readonly Math = Math;
  
  ngOnInit(): void {
    this.adminService.loadData();
  }
  
  // ============================================
  // 🔍 SEARCH & FILTER HANDLERS
  // ============================================
  
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.adminService.setSearch(query);
  }
  
  onRoleChange(role: string): void {
    this.selectedRole = role;
    this.adminService.setFilter({ role: role as any });
  }
  
  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.adminService.setFilter({ status: status as any });
  }
  
  onDepartmentChange(department: string): void {
    this.selectedDepartment = department;
    this.adminService.setFilter({ department });
  }
  
  onRemoveChip(key: 'role' | 'status' | 'department'): void {
    this.adminService.removeFilterChip(key);
    
    // Update local UI state
    if (key === 'role') this.selectedRole = 'all';
    if (key === 'status') this.selectedStatus = 'all';
    if (key === 'department') this.selectedDepartment = 'all';
  }
  
  onResetFilters(): void {
    this.searchQuery = '';
    this.selectedRole = 'all';
    this.selectedStatus = 'all';
    this.selectedDepartment = 'all';
    this.adminService.resetFilters();
  }
  
  // ============================================
  // 📊 SORT HANDLERS
  // ============================================
  
  onSortChange(field: AdminSortField): void {
    this.adminService.setSort(field);
  }
  
  toggleSortDirection(): void {
    const currentSort = this.adminService.sort();
    const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
    this.adminService.setSort(currentSort.field, newDirection);
  }
  
  // ============================================
  // ✅ SELECTION HANDLERS
  // ============================================
  
  onToggleRow(id: number): void {
    this.adminService.toggleRow(id);
  }
  
  onToggleAllVisible(): void {
    this.adminService.toggleAllVisible();
  }
  
  isRowSelected(id: number): boolean {
    return this.adminService.selectedIds().has(id);
  }
  
  // ============================================
  // 🎯 BULK ACTION HANDLERS
  // ============================================
  
  toggleBulkActions(): void {
    this.showBulkActions = !this.showBulkActions;
  }
  
  onBulkDelete(): void {
    this.adminService.bulkDelete();
    this.showBulkActions = false;
  }
  
  onExportCsv(): void {
    this.adminService.exportCsv();
  }
  
  onBulkEmail(): void {
    this.adminService.bulkEmail();
    this.showBulkActions = false;
  }
  
  onBulkUpdateStatus(status: UserStatus): void {
    this.adminService.bulkUpdateStatus(status);
    this.showBulkActions = false;
  }
  
  // ============================================
  // 📄 PAGINATION HANDLERS
  // ============================================
  
  onPageChange(page: number): void {
    this.adminService.setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  onPageSizeChange(size: number): void {
    this.adminService.setPageSize(size);
  }
  
  getPageNumbers(): number[] {
    const totalPages = this.adminService.totalPages();
    const currentPage = this.adminService.page();
    const pages: number[] = [];
    
    const maxPages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  // ============================================
  // 🎨 UI HELPERS
  // ============================================
  
  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'Pending': 'status-pending',
      'Suspended': 'status-suspended'
    };
    return classes[status] || '';
  }
  
  getRoleClass(role: string): string {
    const classes: Record<string, string> = {
      'Admin': 'role-admin',
      'Manager': 'role-manager',
      'Developer': 'role-developer',
      'Designer': 'role-designer',
      'Viewer': 'role-viewer'
    };
    return classes[role] || '';
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }
}
