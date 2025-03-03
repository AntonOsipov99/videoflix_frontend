import { Injectable } from '@angular/core';

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
  currentBackgroundImage: string = this.startImage;
  
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

  constructor() { 
    
  }
}
