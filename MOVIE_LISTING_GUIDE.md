# 🎬 Movie Listing - "Thiên đường Computed Signals"

## 📋 Tổng quan

Movie Listing là một ví dụ hoàn hảo về việc sử dụng **Angular Signals** để quản lý state phức tạp với nhiều tính năng:
- 🔍 **Search** - Tìm kiếm theo title hoặc director
- 🎯 **Filter** - Lọc theo genre, rating, year range
- 📊 **Sort** - Sắp xếp theo title, year, rating, duration
- 📄 **Pagination** - Phân trang với điều khiển đầy đủ
- 📈 **Statistics** - Thống kê real-time

Đây thực sự là **"thiên đường computed signals"** vì tất cả các giá trị phái sinh (filtered, sorted, paged) đều được tính toán tự động thông qua `computed()`.

---

## 🏗️ Kiến trúc State Management

### 1. Base Signals (Writable State)

Đây là các signal gốc, có thể thay đổi trực tiếp:

```typescript
// 🔍 Search query
private readonly _query = signal<string>('');

// 🎯 Filters
private readonly _filters = signal<MovieFilters>({
  genre: 'all',
  minRating: 0,
  yearRange: { from: 1900, to: 2024 }
});

// 📊 Sort options
private readonly _sort = signal<SortOptions>({
  field: 'title',
  direction: 'asc'
});

// 📄 Pagination
private readonly _page = signal<number>(1);
private readonly _pageSize = signal<number>(12);

// 🎬 Data
private readonly _entities = signal<Movie[]>([]);

// ⏳ Loading
private readonly _loading = signal<boolean>(false);
```

**Đặc điểm:**
- Private với prefix `_` để kiểm soát mutations
- Expose readonly version cho external access
- Chỉ có methods trong service mới có thể update

### 2. Computed Signals (Derived State)

Đây là các signal tự động tính toán từ base signals:

```typescript
// 🔍 Step 1: Filter
readonly filteredMovies = computed(() => {
  const movies = this._entities();
  const query = this._query();
  const filters = this._filters();
  
  return movies.filter(movie => {
    // Apply all filters
  });
});

// 📊 Step 2: Sort
readonly sortedMovies = computed(() => {
  const movies = [...this.filteredMovies()];
  const sortOpts = this._sort();
  
  return movies.sort((a, b) => {
    // Apply sorting
  });
});

// 📄 Step 3: Paginate
readonly pagedMovies = computed(() => {
  const movies = this.sortedMovies();
  const page = this._page();
  const pageSize = this._pageSize();
  
  return movies.slice(startIndex, endIndex);
});

// 📊 Statistics
readonly totalPages = computed(() => {
  return Math.ceil(this.filteredMovies().length / this._pageSize());
});

readonly stats = computed(() => ({
  total: this._entities().length,
  filtered: this.filteredMovies().length,
  currentPage: this._page(),
  totalPages: this.totalPages(),
  showing: this.pagedMovies().length
}));
```

**Đặc điểm:**
- Tự động re-compute khi dependencies thay đổi
- Readonly - không thể set trực tiếp
- Memoized - chỉ tính lại khi cần thiết
- Composable - computed có thể depend on computed khác

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      BASE SIGNALS                            │
│  _entities, _query, _filters, _sort, _page, _pageSize       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  COMPUTED PIPELINE                           │
│                                                              │
│  entities ──► filteredMovies ──► sortedMovies ──► pagedMovies│
│     ▲              ▲                  ▲              ▲       │
│     │              │                  │              │       │
│  _entities    _query, _filters    _sort      _page, _pageSize│
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      UI LAYER                                │
│              Template binds to signals                       │
└─────────────────────────────────────────────────────────────┘
```

### Ví dụ cụ thể:

1. **User nhập search query "Matrix"**
   ```typescript
   movieService.setQuery('Matrix');
   // → _query.set('Matrix')
   // → filteredMovies tự động re-compute
   // → sortedMovies tự động re-compute (depends on filteredMovies)
   // → pagedMovies tự động re-compute (depends on sortedMovies)
   // → totalPages tự động re-compute (depends on filteredMovies)
   // → stats tự động re-compute
   // → UI tự động update
   ```

2. **User thay đổi sort**
   ```typescript
   movieService.setSort('rating', 'desc');
   // → _sort.set({ field: 'rating', direction: 'desc' })
   // → sortedMovies tự động re-compute
   // → pagedMovies tự động re-compute
   // → UI tự động update
   // ✅ filteredMovies KHÔNG re-compute (không depend on _sort)
   ```

3. **User chuyển trang**
   ```typescript
   movieService.setPage(2);
   // → _page.set(2)
   // → pagedMovies tự động re-compute
   // → stats tự động re-compute
   // → UI tự động update
   // ✅ filteredMovies và sortedMovies KHÔNG re-compute
   ```

---

## 💡 Tại sao đây là "Thiên đường Computed"?

### 1. **Automatic Reactivity**
Không cần manually subscribe/unsubscribe như RxJS:

```typescript
// ❌ RxJS way - phức tạp
this.filteredMovies$ = combineLatest([
  this.entities$,
  this.query$,
  this.filters$
]).pipe(
  map(([entities, query, filters]) => {
    return entities.filter(/* ... */);
  }),
  shareReplay(1)
);

// ✅ Signals way - đơn giản
readonly filteredMovies = computed(() => {
  const entities = this._entities();
  const query = this._query();
  const filters = this._filters();
  return entities.filter(/* ... */);
});
```

### 2. **Granular Updates**
Chỉ re-compute những gì cần thiết:

```typescript
// Khi _page thay đổi:
// ✅ pagedMovies re-compute
// ✅ stats re-compute
// ❌ filteredMovies KHÔNG re-compute
// ❌ sortedMovies KHÔNG re-compute
```

### 3. **Composability**
Computed signals có thể depend on nhau:

```typescript
readonly filteredMovies = computed(() => {
  // Step 1: Filter
});

readonly sortedMovies = computed(() => {
  const movies = this.filteredMovies(); // ← Depends on another computed
  // Step 2: Sort
});

readonly pagedMovies = computed(() => {
  const movies = this.sortedMovies(); // ← Depends on another computed
  // Step 3: Paginate
});
```

### 4. **Type Safety**
Full TypeScript support:

```typescript
readonly stats = computed(() => ({
  total: this._entities().length,      // ← Type: number
  filtered: this.filteredMovies().length, // ← Type: number
  currentPage: this._page(),           // ← Type: number
  totalPages: this.totalPages(),       // ← Type: number
  showing: this.pagedMovies().length   // ← Type: number
}));
// Return type: { total: number; filtered: number; ... }
```

### 5. **No Memory Leaks**
Không cần unsubscribe:

```typescript
// Component
protected readonly movieService = inject(MovieService);

// Template
{{ movieService.pagedMovies() }}
{{ movieService.stats().total }}

// ✅ Tự động cleanup khi component destroy
// ✅ Không cần ngOnDestroy
```

---

## 🎯 Use Cases trong Template

### 1. Display Computed Data

```html
<!-- Statistics -->
<div class="stat-value">{{ movieService.stats().total }}</div>
<div class="stat-value">{{ movieService.stats().filtered }}</div>

<!-- Movie Grid -->
@for (movie of movieService.pagedMovies(); track movie.id) {
  <article class="movie-card">
    <!-- ... -->
  </article>
}

<!-- Pagination -->
<div>Page {{ movieService.page() }} of {{ movieService.totalPages() }}</div>
```

### 2. Conditional Rendering

```html
<!-- Loading State -->
@if (movieService.loading()) {
  <div class="loading-container">Loading...</div>
}

<!-- Empty States -->
@else if (movieService.emptyState().noMovies) {
  <div>No movies available</div>
}

@else if (movieService.emptyState().noResults) {
  <div>No results found</div>
}

<!-- Movie Grid -->
@else {
  <section class="movies-grid">
    <!-- ... -->
  </section>
}
```

### 3. Dynamic Attributes

```html
<button 
  [disabled]="movieService.page() === 1"
  (click)="previousPage()"
>
  Previous
</button>

<button 
  [disabled]="movieService.page() === movieService.totalPages()"
  (click)="nextPage()"
>
  Next
</button>
```

---

## 🔧 Methods (State Mutations)

### Search

```typescript
setQuery(query: string): void {
  this._query.set(query);
  this._page.set(1); // Reset về trang 1
}
```

### Filter

```typescript
setFilter(filters: Partial<MovieFilters>): void {
  this._filters.update(current => ({ ...current, ...filters }));
  this._page.set(1);
}

resetFilters(): void {
  this._filters.set({
    genre: 'all',
    minRating: 0,
    yearRange: { from: 1900, to: new Date().getFullYear() }
  });
  this._query.set('');
  this._page.set(1);
}
```

### Sort

```typescript
setSort(field: SortField, direction?: SortDirection): void {
  const currentSort = this._sort();
  
  // Toggle direction nếu click vào cùng field
  const newDirection = direction || 
    (currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc');
  
  this._sort.set({ field, direction: newDirection });
}
```

### Pagination

```typescript
setPage(page: number): void {
  const totalPages = this.totalPages();
  if (page >= 1 && page <= totalPages) {
    this._page.set(page);
  }
}

nextPage(): void {
  this.setPage(this._page() + 1);
}

previousPage(): void {
  this.setPage(this._page() - 1);
}

setPageSize(size: number): void {
  this._pageSize.set(size);
  this._page.set(1);
}
```

---

## 📊 Performance Optimization

### 1. Memoization
Computed signals tự động memoize:

```typescript
readonly filteredMovies = computed(() => {
  // Chỉ chạy khi _entities, _query, hoặc _filters thay đổi
  // Nếu không có gì thay đổi, trả về cached value
});
```

### 2. Granular Dependencies
Chỉ track những gì thực sự sử dụng:

```typescript
readonly pagedMovies = computed(() => {
  const movies = this.sortedMovies(); // ← Depends on sortedMovies
  const page = this._page();           // ← Depends on _page
  const pageSize = this._pageSize();   // ← Depends on _pageSize
  
  // ✅ KHÔNG depends on _query, _filters, _sort
  // → Không re-compute khi những signals đó thay đổi
});
```

### 3. Immutability
Clone arrays trước khi sort để tránh mutate:

```typescript
readonly sortedMovies = computed(() => {
  const movies = [...this.filteredMovies()]; // ← Clone
  return movies.sort((a, b) => {
    // Safe to mutate the clone
  });
});
```

---

## 🎨 Component Design

Component rất đơn giản vì tất cả logic ở service:

```typescript
export class MovieListingComponent implements OnInit {
  protected readonly movieService = inject(MovieService);
  
  ngOnInit(): void {
    this.movieService.loadMovies();
  }
  
  // Simple event handlers
  onSearchChange(query: string): void {
    this.movieService.setQuery(query);
  }
  
  onGenreChange(genre: string): void {
    this.movieService.setFilter({ genre });
  }
  
  // ... more handlers
}
```

**Lợi ích:**
- Component chỉ là presentation layer
- Logic tập trung ở service
- Dễ test
- Dễ reuse service ở components khác

---

## 🧪 Testing Strategy

### Service Tests

```typescript
describe('MovieService', () => {
  it('should filter movies by query', () => {
    const service = new MovieService();
    service.loadMovies();
    
    service.setQuery('Matrix');
    
    const filtered = service.filteredMovies();
    expect(filtered.every(m => 
      m.title.includes('Matrix') || m.director.includes('Matrix')
    )).toBe(true);
  });
  
  it('should reset page when filter changes', () => {
    const service = new MovieService();
    service.setPage(3);
    
    service.setFilter({ genre: 'Action' });
    
    expect(service.page()).toBe(1);
  });
});
```

### Component Tests

```typescript
describe('MovieListingComponent', () => {
  it('should load movies on init', () => {
    const service = jasmine.createSpyObj('MovieService', ['loadMovies']);
    const component = new MovieListingComponent();
    component.movieService = service;
    
    component.ngOnInit();
    
    expect(service.loadMovies).toHaveBeenCalled();
  });
});
```

---

## 🚀 Best Practices

### 1. **Private Base Signals**
```typescript
// ✅ Good
private readonly _query = signal<string>('');
readonly query = this._query.asReadonly();

// ❌ Bad
readonly query = signal<string>(''); // Anyone can call .set()
```

### 2. **Immutable Updates**
```typescript
// ✅ Good
setFilter(filters: Partial<MovieFilters>): void {
  this._filters.update(current => ({ ...current, ...filters }));
}

// ❌ Bad
setFilter(filters: Partial<MovieFilters>): void {
  const current = this._filters();
  Object.assign(current, filters); // Mutating!
  this._filters.set(current);
}
```

### 3. **Reset Pagination on Filter/Search**
```typescript
// ✅ Good
setQuery(query: string): void {
  this._query.set(query);
  this._page.set(1); // Reset to page 1
}

// ❌ Bad
setQuery(query: string): void {
  this._query.set(query);
  // User might be on page 10, but filtered results only have 2 pages
}
```

### 4. **Computed Chains**
```typescript
// ✅ Good - Clear pipeline
readonly filteredMovies = computed(() => { /* filter */ });
readonly sortedMovies = computed(() => { 
  const movies = this.filteredMovies();
  /* sort */ 
});
readonly pagedMovies = computed(() => { 
  const movies = this.sortedMovies();
  /* paginate */ 
});

// ❌ Bad - Everything in one computed
readonly displayMovies = computed(() => {
  // Filter, sort, and paginate all in one
  // Hard to read, hard to debug
});
```

---

## 📚 So sánh với NgRx SignalStore

Telerik's NgRx SignalStore cung cấp một abstraction cao hơn:

```typescript
// NgRx SignalStore way
export const MovieStore = signalStore(
  withState(initialState),
  withComputed(({ entities, query, filters }) => ({
    filteredMovies: computed(() => {
      // Filter logic
    })
  })),
  withMethods((store) => ({
    setQuery(query: string) {
      patchState(store, { query, page: 1 });
    }
  }))
);

// Our way (vanilla signals)
export class MovieService {
  private readonly _query = signal<string>('');
  readonly filteredMovies = computed(() => {
    // Filter logic
  });
  setQuery(query: string): void {
    this._query.set(query);
  }
}
```

**Khi nào dùng NgRx SignalStore:**
- Dự án lớn với nhiều stores
- Cần DevTools integration
- Cần entity management utilities
- Team quen với NgRx patterns

**Khi nào dùng vanilla Signals:**
- Dự án nhỏ/vừa
- Muốn control hoàn toàn
- Không cần extra dependencies
- Learning purposes

---

## 🎓 Key Takeaways

1. **Computed Signals = Automatic Reactivity**
   - Không cần manual subscriptions
   - Tự động track dependencies
   - Tự động cleanup

2. **Separation of Concerns**
   - Base signals = Source of truth
   - Computed signals = Derived data
   - Methods = State mutations

3. **Performance by Default**
   - Memoization
   - Granular updates
   - No unnecessary re-computations

4. **Type Safety**
   - Full TypeScript support
   - Compile-time checks
   - Better IDE support

5. **Simplicity**
   - Dễ hiểu
   - Dễ maintain
   - Dễ test

---

## 🔗 Related Concepts

- **Angular Signals** - Core reactive primitive
- **Computed Signals** - Derived state
- **Effect** - Side effects (not used here, but useful for localStorage sync)
- **Signal Inputs** - Component inputs as signals
- **Signal Queries** - ViewChild/ContentChild as signals

---

## 📝 Exercises

1. **Thêm filter theo duration**
   - Thêm `minDuration` và `maxDuration` vào `MovieFilters`
   - Update `filteredMovies` computed
   - Thêm UI controls

2. **Implement localStorage persistence**
   - Save filters, sort, pageSize to localStorage
   - Load on init
   - Use `effect()` to auto-save

3. **Add favorites feature**
   - Thêm `favorites` signal
   - Computed `favoriteMovies`
   - Toggle favorite button

4. **Multi-select filters**
   - Cho phép chọn nhiều genres
   - Update filter logic
   - UI với checkboxes

5. **Advanced search**
   - Search trong description
   - Fuzzy search
   - Highlight matches

---

Chúc bạn học tốt! 🎬✨
