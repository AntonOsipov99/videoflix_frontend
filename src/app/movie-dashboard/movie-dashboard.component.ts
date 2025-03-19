import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Movie, MovieService } from '../services/movie.service';
import { Router } from '@angular/router';
import { ImpressumComponent } from "../impressum/impressum.component";
import { DatenschutzComponent } from "../datenschutz/datenschutz.component";

@Component({
  selector: 'app-movie-dashboard',
  imports: [
    ImpressumComponent,
    DatenschutzComponent,
    CommonModule
  ],
  templateUrl: './movie-dashboard.component.html',
  styleUrl: './movie-dashboard.component.scss'
})
export class MovieDashboardComponent {
  @ViewChild('backgroundVideo') videoElement!: ElementRef<HTMLVideoElement>;

  authService: AuthService = inject(AuthService);
  movieService: MovieService = inject(MovieService);
  router: Router = inject(Router);
  movies: Movie[] = [];
  documentaryMovies: Movie[] = [];
  dramaMovies: Movie[] = [];
  romanceMovies: Movie[] = [];
  newMovies: Movie[] = [];
  loading: boolean = true;
  error: string | null = null;
  featuredMovie: Movie | null = null;
  featuredMovieName: string = '';
  featuredMovieDescription: string = '';
  currentBackgroundVideo: string = '';

  constructor(private viewportScroller: ViewportScroller) { }

  ngOnInit() {
    this.loadMovies();
    this.authService.showCancelButton = true;
  }

  loadMovies() {
    this.loading = true;
    this.error = null;
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filterMoviesByGenres();
        this.selectedFeaturedMovie();
        this.playBackgroundVideo();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    })
  }

  playBackgroundVideo() {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.src = this.currentBackgroundVideo;
      video.muted = true;
      video.play().catch(err => console.error('Video autoplay failed', err));
    }
  }

  filterMoviesByGenres() {
    this.documentaryMovies = this.movies.filter(
      movie => movie.genre === 'Documentary'
    );
    this.dramaMovies = this.movies.filter(
      movie => movie.genre === 'Drama'
    );
    this.romanceMovies = this.movies.filter(
      movie => movie.genre === 'Romance'
    );
    this.newMovies = [...this.movies]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }

  selectedFeaturedMovie() {
    if (this.newMovies.length > 0) {
      this.featuredMovie = this.newMovies[0];
      this.featuredMovieName = this.featuredMovie.title;
      this.featuredMovieDescription = this.featuredMovie.description;
      if (this.featuredMovie.is_processed) {
        this.currentBackgroundVideo = this.movieService.reconstructVideoPath(this.featuredMovie);
      } else {
        this.currentBackgroundVideo = this.featuredMovie.video_file;
      }
    }
  }

  playMovie(movie: Movie) {
    this.movieService.setCurrentMovie(movie);
    this.router.navigate(['/videoplayer']);
  }

  playFeaturedMovie() {
    if (this.featuredMovie) {
      this.movieService.setCurrentMovie(this.featuredMovie);
      this.router.navigate(['/videoplayer']);
    }
  }

  scrollToDatenschutz() {
    setTimeout(() => this.viewportScroller.scrollToAnchor('datenschutz'), 1);
  }

  scrollToImpressum() {
    setTimeout(() => this.viewportScroller.scrollToAnchor('impressum'), 1);
  }

}


