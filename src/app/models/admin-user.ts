/**
 * 👤 Admin User Model
 * Interface cho user data trong admin dashboard
 */
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  joinedDate: Date;
  lastActive: Date;
  tasksCompleted: number;
  avatar?: string;
}

/**
 * 🎭 User Role
 */
export type UserRole = 'Admin' | 'Manager' | 'Developer' | 'Designer' | 'Viewer';

/**
 * 📊 User Status
 */
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended';

/**
 * 🔍 Admin Filters
 */
export interface AdminFilters {
  role: UserRole | 'all';
  status: UserStatus | 'all';
  department: string | 'all';
}

/**
 * 📊 Sort Options
 */
export type AdminSortField = 'name' | 'email' | 'role' | 'status' | 'joinedDate' | 'lastActive' | 'tasksCompleted';
export type SortDirection = 'asc' | 'desc';

export interface AdminSortOptions {
  field: AdminSortField;
  direction: SortDirection;
}

/**
 * 📈 Dashboard Statistics
 */
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
  selectedCount: number;
  filteredCount: number;
}
