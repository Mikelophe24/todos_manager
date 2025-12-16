import { Injectable, signal, computed } from '@angular/core';
import { Movie, MovieFilters, SortOptions, SortField, SortDirection } from '../models/movie';

/**
 * 🎬 Movie Service - "Thiên đường Computed Signals"
 * 
 * Service này quản lý toàn bộ state của Movie Listing sử dụng Angular Signals.
 * Đây là ví dụ điển hình về cách sử dụng computed signals để tự động tính toán
 * các giá trị phái sinh từ state gốc.
 * 
 * 📊 STATE ARCHITECTURE:
 * - Base Signals (writable): query, filters, sort, page, pageSize, entities, loading
 * - Computed Signals (readonly): filteredMovies, sortedMovies, pagedMovies, totalPages, emptyState
 * 
 * 🔄 DATA FLOW:
 * entities → filtered → sorted → paged → UI
 *    ↑         ↑         ↑        ↑
 *  query    filters    sort    page/pageSize
 */
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  
  // ============================================
  // 📝 BASE SIGNALS (Writable State)
  // ============================================
  
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
    yearRange: { from: 1900, to: new Date().getFullYear() }
  });
  readonly filters = this._filters.asReadonly();
  
  /**
   * 📊 Sort options - Sắp xếp theo field và direction
   */
  private readonly _sort = signal<SortOptions>({
    field: 'title',
    direction: 'asc'
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
    
    return movies.filter(movie => {
      // Search filter
      const matchesQuery = !query || 
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query);
      
      // Genre filter
      const matchesGenre = filters.genre === 'all' || movie.genre === filters.genre;
      
      // Rating filter
      const matchesRating = movie.rating >= filters.minRating;
      
      // Year range filter
      const matchesYear = movie.year >= filters.yearRange.from && 
                         movie.year <= filters.yearRange.to;
      
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
    showing: this.pagedMovies().length
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
      hasResults: hasFiltered
    };
  });
  
  /**
   * 🎨 Available Genres
   * Danh sách các thể loại có sẵn (computed từ entities)
   */
  readonly availableGenres = computed(() => {
    const movies = this._entities();
    const genres = new Set(movies.map(m => m.genre));
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
    
    // Simulate API call
    setTimeout(() => {
      this._entities.set(MOCK_MOVIES);
      this._loading.set(false);
    }, 500);
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
    this._filters.update(current => ({ ...current, ...filters }));
    this._page.set(1); // Reset về trang 1 khi filter
  }
  
  /**
   * 🔄 Reset all filters
   */
  resetFilters(): void {
    this._filters.set({
      genre: 'all',
      minRating: 0,
      yearRange: { from: 1900, to: new Date().getFullYear() }
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

// ============================================
// 🎬 MOCK DATA
// ============================================

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    year: 1994,
    genre: 'Drama',
    rating: 9.3,
    duration: 142,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  },
  {
    id: 2,
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    year: 1972,
    genre: 'Crime',
    rating: 9.2,
    duration: 175,
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
  },
  {
    id: 3,
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    year: 2008,
    genre: 'Action',
    rating: 9.0,
    duration: 152,
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    year: 1994,
    genre: 'Crime',
    rating: 8.9,
    duration: 154,
    poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.'
  },
  {
    id: 5,
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    year: 1994,
    genre: 'Drama',
    rating: 8.8,
    duration: 142,
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.'
  },
  {
    id: 6,
    title: 'Inception',
    director: 'Christopher Nolan',
    year: 2010,
    genre: 'Sci-Fi',
    rating: 8.8,
    duration: 148,
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.'
  },
  {
    id: 7,
    title: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    year: 1999,
    genre: 'Sci-Fi',
    rating: 8.7,
    duration: 136,
    poster: 'https://images.unsplash.com/photo-1574267432644-f74f8ec55d1f?w=300&h=450&fit=crop',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
  },
  {
    id: 8,
    title: 'Goodfellas',
    director: 'Martin Scorsese',
    year: 1990,
    genre: 'Crime',
    rating: 8.7,
    duration: 146,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
    description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.'
  },
  {
    id: 9,
    title: 'Interstellar',
    director: 'Christopher Nolan',
    year: 2014,
    genre: 'Sci-Fi',
    rating: 8.6,
    duration: 169,
    poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=450&fit=crop',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
  },
  {
    id: 10,
    title: 'The Silence of the Lambs',
    director: 'Jonathan Demme',
    year: 1991,
    genre: 'Thriller',
    rating: 8.6,
    duration: 118,
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
    description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.'
  },
  {
    id: 11,
    title: 'Saving Private Ryan',
    director: 'Steven Spielberg',
    year: 1998,
    genre: 'War',
    rating: 8.6,
    duration: 169,
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop',
    description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.'
  },
  {
    id: 12,
    title: 'The Green Mile',
    director: 'Frank Darabont',
    year: 1999,
    genre: 'Drama',
    rating: 8.6,
    duration: 189,
    poster: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=300&h=450&fit=crop',
    description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.'
  },
  {
    id: 13,
    title: 'Parasite',
    director: 'Bong Joon Ho',
    year: 2019,
    genre: 'Thriller',
    rating: 8.5,
    duration: 132,
    poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'
  },
  {
    id: 14,
    title: 'The Lion King',
    director: 'Roger Allers, Rob Minkoff',
    year: 1994,
    genre: 'Animation',
    rating: 8.5,
    duration: 88,
    poster: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=300&h=450&fit=crop',
    description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.'
  },
  {
    id: 15,
    title: 'Gladiator',
    director: 'Ridley Scott',
    year: 2000,
    genre: 'Action',
    rating: 8.5,
    duration: 155,
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.'
  },
  {
    id: 16,
    title: 'Spirited Away',
    director: 'Hayao Miyazaki',
    year: 2001,
    genre: 'Animation',
    rating: 8.6,
    duration: 125,
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=450&fit=crop',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.'
  },
  {
    id: 17,
    title: 'Whiplash',
    director: 'Damien Chazelle',
    year: 2014,
    genre: 'Drama',
    rating: 8.5,
    duration: 106,
    poster: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=450&fit=crop',
    description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.'
  },
  {
    id: 18,
    title: 'The Departed',
    director: 'Martin Scorsese',
    year: 2006,
    genre: 'Crime',
    rating: 8.5,
    duration: 151,
    poster: 'https://images.unsplash.com/photo-1574267432644-f74f8ec55d1f?w=300&h=450&fit=crop',
    description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.'
  },
  {
    id: 19,
    title: 'The Prestige',
    director: 'Christopher Nolan',
    year: 2006,
    genre: 'Thriller',
    rating: 8.5,
    duration: 130,
    poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&h=450&fit=crop',
    description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.'
  },
  {
    id: 20,
    title: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    year: 2019,
    genre: 'Action',
    rating: 8.4,
    duration: 181,
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop',
    description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.'
  }
];
