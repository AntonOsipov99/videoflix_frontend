import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(1)]],
      confirm_password: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      } else {
        this.toastr.error('Invalid password reset link');
        this.router.navigate(['']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirm_password')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  toggleToLogin() {
    setTimeout(() => { 
      this.router.navigate(['']); 
      this.authService.toggleToLogIn(); 
    }, 2000);
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) return;
    this.isSubmitting = true;
    const password = this.resetPasswordForm.get('password')?.value;
    const confirm_password = this.resetPasswordForm.get('confirm_password')?.value;
    this.authService.resetPassword(this.token, password, confirm_password).subscribe({
      next: () => { this.toastr.success('Password reset successfully'); this.toggleToLogin(); },
      error: (error) => {
        const isExpired = error.error?.error === 'Token expired';
        this.toastr.error(isExpired ? 'Password reset link has expired' : 'Failed to reset password. Please try again.');
        if (isExpired) this.toggleToLogin();
      },
      complete: () => this.isSubmitting = false
    });
  }
}
