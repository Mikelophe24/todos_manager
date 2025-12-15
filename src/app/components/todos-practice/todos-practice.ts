import { Component, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 📋 Interface cho Todo với status
export interface Todo {
  id: number;
  text: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  createdAt: Date;
}

// 🎨 Type cho status filter
export type StatusFilter = 'All' | 'Pending' | 'In Progress' | 'Complete';

@Component({
  selector: 'app-todos-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos-practice.html',
  styleUrls: ['todos-practice.css'] 
})
export class TodosPracticeComponent {
  todos = signal<Todo[]>([]);

  query = signal<string>('');
  statusFilter = signal<StatusFilter>('All');

  // Biến tạm để lưu text input (không phải signal)
  newTodoText = '';

  // Counter để tạo unique ID
  private nextId = 1;

  // Danh sách các status filters
  statusFilters: StatusFilter[] = ['All', 'Pending', 'In Progress', 'Complete'];

  constructor() {
    // Đọc todos từ localStorage khi khởi tạo component
    this.loadTodosFromLocalStorage();

    // Effect để lưu todos vào localStorage mỗi khi thay đổi
    effect(() => {
      // Đọc todos (tracked - effect sẽ chạy lại khi todos thay đổi)
      const currentTodos = this.todos();
      
      // Đọc query và statusFilter bằng untracked (không tạo dependency)
      const currentQuery = untracked(() => this.query());
      const currentStatusFilter = untracked(() => this.statusFilter());
      
      // Lưu vào localStorage
      localStorage.setItem('angular_todos_practice_v2', JSON.stringify(currentTodos));
      
      // Log để debug
      console.log('💾 Saved to localStorage:', {
        todosCount: currentTodos.length,
        currentQuery: currentQuery,
        currentStatusFilter: currentStatusFilter,
        timestamp: new Date().toLocaleTimeString()
      });
    });
  }

  // Hàm addTodo - dùng update để thêm todo
  addTodo(text: string): void {
    if (!text.trim()) {
      return; // Không thêm todo rỗng
    }

    this.todos.update(currentTodos => {
      const newTodo: Todo = {
        id: this.nextId++,
        text: text.trim(),
        status: 'Pending', // Mặc định là Pending
        createdAt: new Date()
      };
      return [...currentTodos, newTodo];
    });
  }

  // Hàm removeTodo - dùng update để xóa todo theo id
  removeTodo(id: number): void {
    this.todos.update(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id);
    }); 
  }

  // Hàm updateTodoStatus - cập nhật status của todo
  updateTodoStatus(id: number, newStatus: string): void {
    this.todos.update(currentTodos => {
      return currentTodos.map(todo => 
        todo.id === id 
          ? { ...todo, status: newStatus as Todo['status'] }
          : todo
      );
    });
  }

  // Computed để lọc todos theo query và status
  filteredTodos = computed(() => {
    const allTodos = this.todos();
    const searchQuery = this.query().toLowerCase().trim();
    const status = this.statusFilter();

    // Lọc theo status trước
    let filtered = allTodos;
    if (status !== 'All') {
      filtered = filtered.filter(todo => todo.status === status);
    }

    // Sau đó lọc theo search query
    if (searchQuery) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(searchQuery)
      );
    }

    return filtered;
  });

  // Helper method để xử lý việc thêm todo từ UI
  handleAddTodo(): void {
    this.addTodo(this.newTodoText);
    this.newTodoText = ''; // Clear input sau khi thêm
  }

  // Helper method để đếm số lượng todos theo status
  getCountByStatus(status: StatusFilter): number {
    if (status === 'All') {
      return this.todos().length;
    }
    return this.todos().filter(todo => todo.status === status).length;
  }

  // Helper method để lấy icon cho status
  getStatusIcon(status: StatusFilter): string {
    const icons: Record<StatusFilter, string> = {
      'All': '📋',
      'Pending': '⏳',
      'In Progress': '🔄',
      'Complete': '✅'
    };
    return icons[status];   
  }

  // Helper method để format date
  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return d.toLocaleDateString('vi-VN');
  }

  // Helper method để load todos từ localStorage
  private loadTodosFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('angular_todos_practice_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Convert createdAt string back to Date object
          const todos = parsed.map(todo => ({
            ...todo,
            createdAt: new Date(todo.createdAt)
          }));
          this.todos.set(todos);
          
          // Update nextId to be higher than the highest existing id
          if (todos.length > 0) {
            this.nextId = Math.max(...todos.map(t => t.id)) + 1;
          }
          
          console.log('📂 Loaded from localStorage:', todos.length, 'todos');
        }
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
    }
  }
}
