import { Component, signal, computed, effect, untracked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../../services/todos.service';

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
  styleUrls: ['todos-practice.css'],
})
export class TodosPracticeComponent {
  todos = signal<Todo[]>([]);

  query = signal<string>('');
  statusFilter = signal<StatusFilter>('All');

  // Biến tạm để lưu text input (không phải signal)
  newTodoText = '';

  // Danh sách các status filters
  statusFilters: StatusFilter[] = ['All', 'Pending', 'In Progress', 'Complete'];

  // Inject TodosService
  private todosService = inject(TodosService);

  constructor() {
    // Đọc todos từ JSON Server khi khởi tạo component
    this.loadTodosFromServer();
  }

  // Hàm addTodo - gọi API để thêm todo
  addTodo(text: string): void {
    if (!text.trim()) {
      return; // Không thêm todo rỗng
    }

    const newTodo: Omit<Todo, 'id'> = {
      text: text.trim(),
      status: 'Pending', // Mặc định là Pending
      createdAt: new Date(),
    };

    this.todosService.addTodo(newTodo).subscribe({
      next: (createdTodo) => {
        this.todos.update((currentTodos) => [...currentTodos, createdTodo]);
        console.log('✅ Todo added:', createdTodo);
      },
      error: (error) => {
        console.error('❌ Error adding todo:', error);
      },
    });
  }

  // Hàm removeTodo - gọi API để xóa todo
  removeTodo(id: number): void {
    this.todosService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
        console.log('✅ Todo deleted:', id);
      },
      error: (error) => {
        console.error('❌ Error deleting todo:', error);
      },
    });
  }

  // Hàm updateTodoStatus - gọi API để cập nhật status
  updateTodoStatus(id: number, newStatus: string): void {
    this.todosService.updateTodo(id, { status: newStatus as Todo['status'] }).subscribe({
      next: (updatedTodo) => {
        this.todos.update((currentTodos) =>
          currentTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        console.log('✅ Todo updated:', updatedTodo);
      },
      error: (error) => {
        console.error('❌ Error updating todo:', error);
      },
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
      filtered = filtered.filter((todo) => todo.status === status);
    }

    // Sau đó lọc theo search query
    if (searchQuery) {
      filtered = filtered.filter((todo) => todo.text.toLowerCase().includes(searchQuery));
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
    return this.todos().filter((todo) => todo.status === status).length;
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

  // Helper method để load todos từ JSON Server
  private loadTodosFromServer(): void {
    this.todosService.getAllTodos().subscribe({
      next: (todos) => {
        // Convert createdAt strings to Date objects
        const parsedTodos = todos.map((todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
        this.todos.set(parsedTodos);
      },
      error: (error) => {},
    });
  }
}
