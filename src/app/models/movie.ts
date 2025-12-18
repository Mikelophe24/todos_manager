
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

export interface MovieFilters {
  genre: string; // 'all' hoặc tên thể loại cụ thể
  minRating: number; // Rating tối thiểu
  yearRange: {
    from: number;
    to: number;
  };
}

export type SortField = 'title' | 'year' | 'rating' | 'duration';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection; 
}
