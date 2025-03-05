import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LogInComponent } from "./log-in/log-in.component";
import { AuthService } from '../services/auth.service';
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SignUpComponent } from './sign-up/sign-up.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-start-page',
  imports: [
    CommonModule,
    FormsModule,
    LogInComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    RouterModule
],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss'
})
export class StartPageComponent {

  authService: AuthService = inject(AuthService); 

}
