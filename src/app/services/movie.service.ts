import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';



export interface Movie {
  id: number;
  created_at: string;
  title: string;
  description: string;
  video_file: string;
  genre: string;
  image: string;
  is_processed: boolean;
  available_resolutions: string[];
  hls_manifest: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = 'https://backend.anton-videoflix-server.de/api/movies/';
  private _movieSrc: string = '';
  currentMovie: Movie | null = null;

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching movies:', error);
        return throwError(() => new Error('Failed to fetch movies. Please try again later'));
      })
    );
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}${id}/`).pipe(
      catchError(error => {
        console.error(`Error fetching movie ${id}:`,error);
        return throwError(() => new Error('Failed to fetch movie details. Please try again later'));
      })
    )
  }

  get movieSrc(): string {
    if (this._movieSrc === '') {
      const storedSrc = localStorage.getItem('movieSrc');
      if (storedSrc) {
        this._movieSrc = storedSrc;
      }
    } 
    return this._movieSrc;
  }

  set movieSrc(value: string) {
    this._movieSrc = value;
    localStorage.setItem('movieSrc', value);
  }

setCurrentMovie(movie: Movie) {
  this.currentMovie = movie;
  if (movie.is_processed && movie.hls_manifest) {
    const baseUrl = 'https://backend.anton-videoflix-server.de/media/';
    const hlsUrl = `${baseUrl}${movie.hls_manifest}`;
    this.movieSrc = hlsUrl;
  } else {
    this.movieSrc = movie.video_file;
  }
}
  
}
