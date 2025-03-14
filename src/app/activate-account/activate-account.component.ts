import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate-account',
  imports: [CommonModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  
  statusMessage: string = 'Activating your account...';
  isLoading: boolean = true;
  
  ngOnInit() {
    this.processActivation();
  }
  
  private async processActivation() {
    const key = this.route.snapshot.paramMap.get('key');
    if (!key) {
      this.showError('Invalid activation link');
      return;
    }
    try {
      await this.authService.activateAccount(key);
    } catch (error) {
      this.showError('Failed to activate your account');
    }
  }
  
  private showError(message: string) {
    this.statusMessage = message;
    this.isLoading = false;
  }
  
}
