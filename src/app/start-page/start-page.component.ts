import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LogInComponent } from "./log-in/log-in.component";
import { AuthService } from '../services/auth.service';
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'app-start-page',
  imports: [
    CommonModule,
    FormsModule,
    LogInComponent,
    ForgotPasswordComponent,
    SignUpComponent
],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss'
})
export class StartPageComponent {

  authService: AuthService = inject(AuthService); 
  backgroundImage: string = this.authService.startImage

  toggleToLogIn() {
    this.backgroundImage = this.authService.cinemaImage;
    this.authService.showStartPage = false;
    this.authService.showLogin = true;
    this.authService.showForgotPassword = false;
  }

  toggleToSignUp() {
    this.authService.showStartPage = false;
    this.authService.showLogin = false;
    this.authService.showForgotPassword = false;
    this.authService.showSignUp = true;
  }

}
