# Tuhoc2

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

## 🔐 Authentication Module (NEW!)

**Complete authentication system** với DummyJSON API đã được thêm vào!

### 🚀 Quick Start
```bash
npm start
# Mở http://localhost:4200
# Login: emilys / emilyspass
```

### 📚 Documentation
- **[START_HERE.md](./START_HERE.md)** ← Bắt đầu từ đây!
- **[AUTH_INDEX.md](./AUTH_INDEX.md)** - Lộ trình học
- **[AUTH_README.md](./AUTH_README.md)** - Tổng quan
- **[AUTH_GUIDE.md](./AUTH_GUIDE.md)** - Hướng dẫn chi tiết
- **[AUTH_QUICK_REF.md](./AUTH_QUICK_REF.md)** - Tra cứu nhanh
- **[AUTH_DEMO_GUIDE.md](./AUTH_DEMO_GUIDE.md)** - Test scenarios

### ✨ Features
✅ Login/Logout với DummyJSON API  
✅ State management với Angular Signals  
✅ HTTP Interceptor (auto attach token + handle 401)  
✅ Route Guards (auth protection)  
✅ Token refresh tự động  
✅ LocalStorage persistence  
✅ Comprehensive documentation (Vietnamese)  

### 📁 Location
```
src/app/auth/
├── models/          # Interfaces
├── store/           # State management
├── services/        # API calls
├── interceptors/    # HTTP interceptor
├── guards/          # Route guards
└── components/      # UI components
```

---


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
