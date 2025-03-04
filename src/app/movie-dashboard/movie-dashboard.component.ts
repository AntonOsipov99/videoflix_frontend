import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-movie-dashboard',
  imports: [CommonModule,],
  templateUrl: './movie-dashboard.component.html',
  styleUrl: './movie-dashboard.component.scss'
})
export class MovieDashboardComponent {

movies: string[] = [
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
  'assets/img/whales.svg',
]

authService: AuthService = inject(AuthService);

}
