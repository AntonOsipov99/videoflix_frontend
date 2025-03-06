import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  showStartPage: boolean = true;
  showLogin: boolean = false;
  showForgotPassword: boolean = false;
  showSignUp: boolean = false;
  startImage: string = 'assets/img/videoflix-background.jpg';
  cinemaImage: string = 'assets/img/cinema.jpg';
  emailSignUp: string = '';
  currentBackgroundImage: string = this.startImage;
  private router = inject(Router);
  
  setPageState(page: 'start' | 'login' | 'signup' | 'forgot') {
    this.showStartPage = page === 'start';
    this.showLogin = page === 'login';
    this.showForgotPassword = page === 'forgot';
    this.showSignUp = page === 'signup';
    
    this.currentBackgroundImage = page === 'start' 
      ? this.startImage 
      : this.cinemaImage;
  }

  toggleToStartPage() {
    this.setPageState('start');
  }
  
  toggleToLogIn() {
    this.setPageState('login');
  }
  
  toggleToSignUp() {
    this.setPageState('signup');
  }
  
  toggleToForgotPassword() {
    this.setPageState('forgot');
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('preferredQuality');
    localStorage.removeItem('movieSrc');
    this.router.navigate(['']);
    this.toggleToStartPage();
  }

  constructor() { 
    
  }
}
