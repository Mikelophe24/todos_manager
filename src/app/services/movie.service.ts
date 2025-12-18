import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie, MovieFilters, SortOptions, SortField, SortDirection } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/movies';

  /**
   * 🔍 Search query - Tìm kiếm theo title hoặc director
   */
  private readonly _query = signal<string>('');
  readonly query = this._query.asReadonly();

  /**
   * 🎯 Filters - Bộ lọc theo genre, rating, year
   */
  private readonly _filters = signal<MovieFilters>({
    genre: 'all',
    minRating: 0,
    yearRange: { from: 1900, to: new Date().getFullYear() },
  });
  readonly filters = this._filters.asReadonly();

  /**
   * 📊 Sort options - Sắp xếp theo field và direction
   */
  private readonly _sort = signal<SortOptions>({
    field: 'title',
    direction: 'asc',
  });
  readonly sort = this._sort.asReadonly();

  /**
   * 📄 Pagination state
   */
  private readonly _page = signal<number>(1);
  readonly page = this._page.asReadonly();

  private readonly _pageSize = signal<number>(12);
  readonly pageSize = this._pageSize.asReadonly();

  /**
   * 🎬 Movies data - Danh sách tất cả phim
   */
  private readonly _entities = signal<Movie[]>([]);
  readonly entities = this._entities.asReadonly();

  /**
   * ⏳ Loading state
   */
  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  // ============================================
  // 🧮 COMPUTED SIGNALS (Derived State)
  // ============================================

  /**
   * 🔍 Filtered Movies
   * Tự động filter movies dựa trên query và filters
   */
  readonly filteredMovies = computed(() => {
    const movies = this._entities();
    const query = this._query().toLowerCase().trim();
    const filters = this._filters();

    return movies.filter((movie) => {
      // Search filter
      const matchesQuery =
        !query ||
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query);

      // Genre filter
      const matchesGenre = filters.genre === 'all' || movie.genre === filters.genre;

      // Rating filter
      const matchesRating = movie.rating >= filters.minRating;

      // Year range filter
      const matchesYear =
        movie.year >= filters.yearRange.from && movie.year <= filters.yearRange.to;

      return matchesQuery && matchesGenre && matchesRating && matchesYear;
    });
  });

  /**
   * 📊 Sorted Movies
   * Tự động sort filtered movies dựa trên sort options
   */
  readonly sortedMovies = computed(() => {
    const movies = [...this.filteredMovies()]; // Clone để không mutate
    const sortOpts = this._sort();

    return movies.sort((a, b) => {
      const aValue = a[sortOpts.field];
      const bValue = b[sortOpts.field];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortOpts.direction === 'asc' ? comparison : -comparison;
    });
  });

  /**
   * 📄 Paged Movies
   * Tự động phân trang sorted movies
   */
  readonly pagedMovies = computed(() => {
    const movies = this.sortedMovies();
    const page = this._page();
    const pageSize = this._pageSize();

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return movies.slice(startIndex, endIndex);
  });

  /**
   * 📊 Total Pages
   * Tự động tính tổng số trang
   */
  readonly totalPages = computed(() => {
    const totalItems = this.filteredMovies().length;
    const pageSize = this._pageSize();
    return Math.ceil(totalItems / pageSize) || 1;
  });

  /**
   * 📈 Statistics
   * Thống kê tổng quan
   */
  readonly stats = computed(() => ({
    total: this._entities().length,
    filtered: this.filteredMovies().length,
    currentPage: this._page(),
    totalPages: this.totalPages(),
    showing: this.pagedMovies().length,
  }));

  /**
   * 🎭 Empty State
   * Kiểm tra các trạng thái empty khác nhau
   */
  readonly emptyState = computed(() => {
    const hasMovies = this._entities().length > 0;
    const hasFiltered = this.filteredMovies().length > 0;
    const isLoading = this._loading();

    return {
      noMovies: !hasMovies && !isLoading,
      noResults: hasMovies && !hasFiltered && !isLoading,
      hasResults: hasFiltered,
    };
  });

  /**
   * 🎨 Available Genres
   * Danh sách các thể loại có sẵn (computed từ entities)
   */
  readonly availableGenres = computed(() => {
    const movies = this._entities();
    const genres = new Set(movies.map((m) => m.genre));
    return ['all', ...Array.from(genres).sort()];
  });

  // ============================================
  // 🔧 METHODS (State Mutations)
  // ============================================

  /**
   * 📥 Load movies data
   */
  loadMovies(): void {
    this._loading.set(true);

    this.http.get<Movie[]>(this.apiUrl).subscribe({
      next: (movies) => {
        this._entities.set(movies);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading movies:', error);
        this._loading.set(false);
      },
    });
  }

  /**
   * 🔍 Set search query
   */
  setQuery(query: string): void {
    this._query.set(query);
    this._page.set(1); // Reset về trang 1 khi search
  }

  /**
   * 🎯 Set filter
   */
  setFilter(filters: Partial<MovieFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
    this._page.set(1); // Reset về trang 1 khi filter
  }

  /**
   * 🔄 Reset all filters
   */
  resetFilters(): void {
    this._filters.set({
      genre: 'all',
      minRating: 0,
      yearRange: { from: 1900, to: new Date().getFullYear() },
    });
    this._query.set('');
    this._page.set(1);
  }

  /**
   * 📊 Set sort options
   */
  setSort(field: SortField, direction?: SortDirection): void {
    const currentSort = this._sort();

    // Toggle direction nếu click vào cùng field
    const newDirection =
      direction ||
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
   * ⏭️ Next page
   */
  nextPage(): void {
    this.setPage(this._page() + 1);
  }

  /**
   * ⏮️ Previous page
   */
  previousPage(): void {
    this.setPage(this._page() - 1);
  }

  /**
   * 📏 Set page size
   */
  setPageSize(size: number): void {
    this._pageSize.set(size);
    this._page.set(1); // Reset về trang 1
  }
}
