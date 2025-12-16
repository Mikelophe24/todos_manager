import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { SortField } from '../../models/movie';

/**
 * 🎬 Movie Listing Component
 * 
 * Component hiển thị danh sách phim với đầy đủ tính năng:
 * - 🔍 Search
 * - 🎯 Filter (genre, rating, year)
 * - 📊 Sort (title, year, rating, duration)
 * - 📄 Pagination
 * - 📈 Statistics
 * 
 * Component này chỉ đơn giản là consume các computed signals từ MovieService.
 * Tất cả logic phức tạp đều được xử lý trong service thông qua computed signals.
 */
@Component({
  selector: 'app-movie-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-listing.html',
  styleUrl: './movie-listing.scss'
})
export class MovieListingComponent implements OnInit {
  
  // 💉 Inject MovieService
  protected readonly movieService = inject(MovieService);
  
  // 🎨 UI State
  protected showFilters = true;
  protected searchQuery = '';
  protected selectedGenre = 'all';
  protected minRating = 0;
  protected yearFrom = 1900;
  protected yearTo = new Date().getFullYear();
  
  // 📊 Sort field options
  protected readonly sortFields: { value: SortField; label: string }[] = [
    { value: 'title', label: 'Title' },
    { value: 'year', label: 'Year' },
    { value: 'rating', label: 'Rating' },
    { value: 'duration', label: 'Duration' }
  ];
  
  // 📏 Page size options
  protected readonly pageSizeOptions = [6, 12, 24, 48];
  
  // 🔢 Expose Math for template
  protected readonly Math = Math;
  
  ngOnInit(): void {
    // Load movies khi component khởi tạo
    this.movieService.loadMovies();
  }
  
  // ============================================
  // 🔍 SEARCH & FILTER HANDLERS
  // ============================================
  
  /**
   * Handle search input change
   */
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.movieService.setQuery(query);
  }
  
  /**
   * Handle genre filter change
   */
  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.movieService.setFilter({ genre });
  }
  
  /**
   * Handle rating filter change
   */
  onRatingChange(rating: number): void {
    this.minRating = rating;
    this.movieService.setFilter({ minRating: rating });
  }
  
  /**
   * Handle year range filter change
   */
  onYearRangeChange(): void {
    this.movieService.setFilter({
      yearRange: {
        from: this.yearFrom,
        to: this.yearTo
      }
    });
  }
  
  /**
   * Reset all filters
   */
  onResetFilters(): void {
    this.searchQuery = '';
    this.selectedGenre = 'all';
    this.minRating = 0;
    this.yearFrom = 1900;
    this.yearTo = new Date().getFullYear();
    this.movieService.resetFilters();
  }
  
  // ============================================
  // 📊 SORT HANDLERS
  // ============================================
  
  /**
   * Handle sort change
   */
  onSortChange(field: SortField): void {
    this.movieService.setSort(field);
  }
  
  /**
   * Toggle sort direction
   */
  toggleSortDirection(): void {
    const currentSort = this.movieService.sort();
    const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
    this.movieService.setSort(currentSort.field, newDirection);
  }
  
  // ============================================
  // 📄 PAGINATION HANDLERS
  // ============================================
  
  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    this.movieService.setPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Go to next page
   */
  nextPage(): void {
    this.movieService.nextPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Go to previous page
   */
  previousPage(): void {
    this.movieService.previousPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Change page size
   */
  onPageSizeChange(size: number): void {
    this.movieService.setPageSize(size);
  }
  
  /**
   * Get page numbers for pagination
   */
  getPageNumbers(): number[] {
    const totalPages = this.movieService.totalPages();
    const currentPage = this.movieService.page();
    const pages: number[] = [];
    
    // Hiển thị tối đa 7 số trang
    const maxPages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    // Điều chỉnh nếu ở cuối
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  // ============================================
  // 🎨 UI HELPERS
  // ============================================
  
  /**
   * Toggle filters panel
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  /**
   * Get star rating array
   */
  getStars(rating: number): boolean[] {
    const fullStars = Math.floor(rating / 2); // Convert 0-10 to 0-5
    return Array(5).fill(false).map((_, i) => i < fullStars);
  }
  
  /**
   * Format duration to hours and minutes
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}
