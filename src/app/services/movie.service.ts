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
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = 'http://127.0.0.1:8000/api/movies/';

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

}
