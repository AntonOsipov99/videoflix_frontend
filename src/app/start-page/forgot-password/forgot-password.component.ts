import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    const email = this.forgotPasswordForm.get('email')?.value;
    this.isSubmitting = true;
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.toastr.success('Password reset link sent to your email');
        this.forgotPasswordForm.reset();
        setTimeout(() => this.authService.toggleToLogIn(), 2000);
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
  }
}
