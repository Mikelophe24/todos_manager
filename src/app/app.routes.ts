import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user';
import { UserDetailComponent } from './components/user-detail/user-detail';
import { TodosPracticeComponent } from './components/todos-practice/todos-practice';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserComponent
  },
  {
    // 🎯 Route với parameter động :id
    path: 'users/:id',
    component: UserDetailComponent
  },
  {
    // 📝 Route cho bài tập Todos Practice
    path: 'todos-practice',
    component: TodosPracticeComponent
  }
];
