import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Observable } from 'rxjs';

interface RegistrationResponse {
  message?: string;
  email?: string[];
  password?: string[];
  repeated_password?: string[];
  non_field_errors?: string[];
}

interface ActivationResponse {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private apiUrl = 'http://127.0.0.1:8000/api';
  showStartPage: boolean = true;
  showLogin: boolean = false;
  showForgotPassword: boolean = false;
  showSignUp: boolean = false;
  showResetPassword: boolean = false;
  showDatenschutz: boolean = false;
  showImpressum: boolean = false;
  showCancelButton: boolean = false;
  startImage: string = 'assets/img/videoflix-background.jpg';
  cinemaImage: string = 'assets/img/cinema.jpg';
  emailSignUp: string = '';
  currentBackgroundImage: string = this.startImage;

  setPageState(page: 'start' | 'login' | 'signup' | 'forgot' | 'reset' | 'datenschutz' | 'impressum') {
    this.showStartPage = page === 'start';
    this.showLogin = page === 'login';
    this.showForgotPassword = page === 'forgot';
    this.showSignUp = page === 'signup';
    this.showResetPassword = page === 'reset';
    this.showDatenschutz = page === 'datenschutz';
    this.showImpressum = page === 'impressum';

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

  toggleToResetPassword() {
    this.setPageState('reset');
  }

  toggleToDatenschutz() {
    this.setPageState('datenschutz');
  }

  toggleToImpressum() {
    this.setPageState('impressum');
  }

  closeDatenschutz() {
    this.showDatenschutz = false;
    this.showResetPassword = true;
  }

  closeImpressum() {
    this.showImpressum = false;
    this.showResetPassword = true;
  }

  async register(email: string, password: string, repeatedPassword: string) {
    try {
      const response = await firstValueFrom(this.http.post<RegistrationResponse>(
        `${this.apiUrl}/auth/registration/`,
        { email, password, repeated_password: repeatedPassword }
      ));
      const validationErrors = this.extractValidationErrors(response);
      if (Object.keys(validationErrors).length > 0) {
        return { success: false, errors: validationErrors };
      }
      this.toastr.success('An activation link was sent to your email.', 'Successful registration');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, errors: this.parseErrorResponse(error) };
    }
  }

  private extractValidationErrors(response: any) {
    const validationFields = ['email', 'password', 'repeated_password', 'non_field_errors'];
    const errors: Record<string, string[]> = {};
    for (const field of validationFields) {
      if (response[field]) {
        errors[field] = Array.isArray(response[field])
          ? response[field]
          : [response[field]];
      }
    }

    return errors;
  }

  private parseErrorResponse(error: any) {
    if (error.error && typeof error.error === 'object') {
      return this.extractValidationErrors(error.error);
    }

    return {
      'non_field_errors': ['An unexpected error occurred. Please try again.']
    };
  }

  toggleToLogInScreen() {
    this.router.navigate(['']);
    this.toggleToLogIn();
  }

  async activateAccount(activationKey: string) {
    try {
      await firstValueFrom(this.http.get<ActivationResponse>(
        `${this.apiUrl}/auth/activate/${activationKey}`
      ));
      this.toastr.success( 'You can now log in to your account', 'Account activated successfully');
      setTimeout(() => this.toggleToLogInScreen(), 2000);
      return true;
    } catch (error) {
      this.toastr.error('Please try again or contact support', 'Activation failed');
      setTimeout(() => this.toggleToSignUp, 2000);
      return false;
    }
  }

  async handleActivationFromRoute(route: ActivatedRouteSnapshot) {
    const key = route.paramMap.get('key');
    if (!key) {
      this.handleInvalidActivationKey();
      return;
    }
    const success = await this.activateAccount(key);
    this.redirectAfterActivation(success);
  }
  
  private handleInvalidActivationKey() {
    this.toastr.error('Invalid activation link', 'Activation failed');
    this.toggleToSignUp();
  }

  private redirectAfterActivation(success: boolean) {
    if (success) {
      setTimeout(() => this.toggleToLogIn(), 2000);
    } else {
      setTimeout(() => this.toggleToSignUp(), 2000);
    }
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('preferredQuality');
    localStorage.removeItem('movieSrc');
    this.router.navigate(['']);
    this.toggleToStartPage();
    this.showCancelButton = false;
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/auth/forgot-password/`, { email });
  }

  resetPassword(token: string, password: string, confirm_password: string) {
    return this.http.post(`${this.apiUrl}/auth/reset-password/`, {
      token,
      password,
      confirm_password
    });
  }

}
