import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user';
import { UserDetailComponent } from './components/user-detail/user-detail';
import { TodosPracticeComponent } from './components/todos-practice/todos-practice';
import { MovieListingComponent } from './components/movie-listing/movie-listing';
import { MovieDetailComponent } from './components/movie-detail/movie-detail';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';

// 🔐 Import Auth Components và Guards
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { DashboardComponent } from './auth/components/dashboard/dashboard.component';
import { ProfileComponent } from './auth/components/profile/profile.component';
import { authGuard, guestGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  
  // 🔐 AUTH ROUTES - Authentication Module
  {
    path: 'auth',
    children: [
      {
        // 🔑 Login - Chỉ cho phép truy cập khi chưa đăng nhập
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard]
      },
      {
        // 📝 Register - Chỉ cho phép truy cập khi chưa đăng nhập
        path: 'register',
        component: RegisterComponent,
        canActivate: [guestGuard]
      },
      {
        // 📊 Dashboard - Yêu cầu đăng nhập
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
      },
      {
        // 👤 Profile - Yêu cầu đăng nhập
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
      }
    ]
  },

  // 📋 EXISTING ROUTES
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
  },
  {
    // 🎬 Route cho Movie Listing - "Thiên đường Computed Signals"
    path: 'movies',
    component: MovieListingComponent
  },
  {
    // 🎬 Route cho Movie Detail - Hiển thị chi tiết phim
    path: 'movies/:id',
    component: MovieDetailComponent
  },
  {
    // 👥 Route cho Admin Dashboard - "UI State Heaven"
    path: 'admin',
    component: AdminDashboardComponent
  },
];
