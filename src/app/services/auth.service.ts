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
  

  constructor() { 
    
  }
}
