import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  authService: AuthService = inject(AuthService)

  logIn() {

  }

  toggleToForgotPassword() {
    this.authService.showLogin = false;  
    this.authService.showForgotPassword = true;
  }
}
