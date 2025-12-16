import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

/**
 * 🎬 Movie Detail Component
 * 
 * Hiển thị thông tin chi tiết của một bộ phim.
 * Sử dụng route parameter :id để lấy movie ID.
 * 
 * Features:
 * - Hiển thị poster lớn
 * - Thông tin đầy đủ (title, director, year, genre, rating, duration)
 * - Mô tả chi tiết
 * - Star rating visualization
 * - Nút Back để quay lại danh sách
 */
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss'
})
export class MovieDetailComponent implements OnInit {
  
  // 💉 Inject dependencies
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly movieService = inject(MovieService);
  
  // 🎯 Get movie ID from route params
  protected readonly movieId = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    )
  );
  
  // 🎬 Find movie by ID using computed signal
  protected readonly movie = computed(() => {
    const id = this.movieId();
    const movies = this.movieService.entities();
    return movies.find(m => m.id === id);
  });
  
  // 📊 Computed properties
  protected readonly notFound = computed(() => {
    return this.movieId() !== undefined && !this.movie();
  });
  
  ngOnInit(): void {
    // Load movies nếu chưa có
    if (this.movieService.entities().length === 0) {
      this.movieService.loadMovies();
    }
  }
  
  // ============================================
  // 🎨 UI HELPERS
  // ============================================
  
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
  
  /**
   * Get rating color based on value
   */
  getRatingColor(rating: number): string {
    if (rating >= 9.0) return '#10b981'; // Green
    if (rating >= 8.5) return '#3b82f6'; // Blue
    if (rating >= 8.0) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }
  
  /**
   * Navigate back to movie listing
   */
  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
