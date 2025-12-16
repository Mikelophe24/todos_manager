/**
 * 🎬 Movie Model
 * Interface định nghĩa cấu trúc dữ liệu cho một bộ phim
 */
export interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  genre: string;
  rating: number; // 0-10
  duration: number; // phút
  poster: string; // URL ảnh poster
  description: string;
}

/**
 * 🔍 Filter Options
 * Interface cho các tùy chọn filter
 */
export interface MovieFilters {
  genre: string; // 'all' hoặc tên thể loại cụ thể
  minRating: number; // Rating tối thiểu
  yearRange: {
    from: number;
    to: number;
  };
}

/**
 * 📊 Sort Options
 */
export type SortField = 'title' | 'year' | 'rating' | 'duration';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}
