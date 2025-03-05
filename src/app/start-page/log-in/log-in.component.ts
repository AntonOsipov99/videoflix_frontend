import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  authService: AuthService = inject(AuthService);
  router = inject(Router);
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  wrongInput: boolean = false;


  async logIn() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      this.wrongInput = true;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.wrongInput = false;

    try {
      const response = await fetch('https://backend.anton-videoflix-server.de/api/auth/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      });
      const data = await response.json();

      if (!response.ok) {
        this.errorMessage = data.email || data.password || data.non_field_errors || 'Login failed';
        this.isLoading = false;
        this.wrongInput = true;
        return;
      }
      localStorage.setItem('token', data.token);
      this.router.navigate(['/movie-dashboard']);
    } catch (error) {
      console.log('Login error:', error);
      this.errorMessage = 'Connection error. Please try again.';
      this.wrongInput = true;
    } finally {
      this.isLoading = false;
    }
  }
}
