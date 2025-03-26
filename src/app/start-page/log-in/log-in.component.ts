import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

  async logIn() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password })
      });
      const data = await response.json();
      if (!response.ok) { this.toastr.error('Please check your entries and try again.'); return false; }
      if (!data.is_active) { this.toastr.error('Your account is not activated. Please check your emails and click on the activation link.'); return false; }
      localStorage.setItem('token', data.token); this.router.navigate(['/movie-dashboard']); return true;
    } catch (error) {
      this.toastr.error('Connection error. Please try again.'); return false;
    }
  }

  async guestLogIn() {
    alert('If you want to use this Guest Log In function, then register an account, delete the Alert() and comment on the code under the Alert() again and enter the data of the registration under email and password in the guestLogIn function.');
    //   try {
    //     const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
    //       method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ email: 'your registrated email', password: 'your registrated password' })
    //     });
    //     const data = await response.json();
    //     if (!response.ok) { this.toastr.error('Please check your entries and try again.'); return false; }
    //     if (!data.is_active) { this.toastr.error('Your account is not activated. Please check your emails and click on the activation link.'); return false; }
    //     localStorage.setItem('token', data.token); this.router.navigate(['/movie-dashboard']); return true;
    //   } catch (error) {
    //     this.toastr.error('Connection error. Please try again.'); return false;
    //   } 
    // }
  }
}