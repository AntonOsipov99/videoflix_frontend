import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  authService: AuthService = inject(AuthService);
  email: string = this.authService.emailSignUp;
  password: string = '';
  repeatedPassword: string = '';
  errorMessage: string = '';
  wrongInput: boolean = false;

  ngOnInit() {
    this.authService.emailSignUp = '';
  }

  async signUp() {
    if (!this.email || !this.password || !this.repeatedPassword) {
      this.wrongInput = true;
      this.errorMessage = 'The fields must all be filled out.';
      return;
    }
    if (this.password !== this.repeatedPassword) {
      this.wrongInput = true;
      this.errorMessage = "The passwords don't match";
      return;
    }
    this.errorMessage = '';
    this.wrongInput = false;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/registration/", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          repeated_password: this.repeatedPassword
        })
      });
      const data = await response.json();
      if (!response.ok || data.email || data.username) {
        this.errorMessage = data.email || data.password || data.non_field_errors || 'Registration failed';
        this.wrongInput = true;
        return;
      }
      this.authService.toggleToLogIn();
    } catch (error) {
      console.log('Registration error:', error);
      this.errorMessage = 'Connection error. Please try again.';
      this.wrongInput = true;
    }
  }
}