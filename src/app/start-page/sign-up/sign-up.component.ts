import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  repeatedPassword = new FormControl('', [Validators.required]);
  errorMessage: string = '';

  ngOnInit() {
    if (this.authService.emailSignUp) 
      this.email.setValue(this.authService.emailSignUp);
  }

    passwordsMatch() {
    return this.password.value === this.repeatedPassword.value;
  }

  validateForm() {
    if (!this.email.valid || !this.password.valid || 
        !this.repeatedPassword.valid) {
      return false;
    }
    
    if (!this.passwordsMatch()) {
      this.showError('Passwords must match.');
      return false;
    }
    
    return true;
  }
  
  async signUp(event: Event) {
    event.preventDefault();
    if (!this.validateForm()) return;
    const result = await this.authService.register(
      this.email.value || '',
      this.password.value || '',
      this.repeatedPassword.value || ''
    );
    if (result.success) {
      setTimeout(() => this.authService.toggleToLogIn(), 2000);
    } else {
      this.handleRegistrationErrors(result.errors || {});
    }
  }

  private handleRegistrationErrors(errors: Record<string, string[]>) {
    const fieldPriority = ['email', 'password', 'repeated_password', 'non_field_errors'];
    for (const field of fieldPriority) {
      if (errors[field]?.length) {
        this.showError(errors[field][0]);
        return;
      }
    }
    this.showError('An error occurred during registration. Please try again.');
  }
  
  private showError(message: string) {
    this.errorMessage = message;
    this.toastr.error(message, 'Registration failed');
  }
}