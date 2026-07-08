import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Auth} from '../../../services/auth';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  model = {
    token: '',
    newPassword: '',
    confirmPassword: '',
  };

  showPassword   = signal(false);
  showConfirm    = signal(false);
  submitted      = signal(false);
  isLoading      = signal(false);
  errorMessage   = signal('');
  successMessage = signal('');

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  togglePassword() { this.showPassword.update(v => !v); }
  toggleConfirm()  { this.showConfirm.update(v => !v); }

  onSubmit(form: any) {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (form.invalid) return;

    if (this.model.newPassword !== this.model.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);

    this.authService.resetPassword(this.model).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set(
            response.message || 'Password reset successfully! Redirecting to login...'
          );
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage.set(response.message || 'Reset failed. Please try again.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Token expired or invalid. Please request a new one.'
        );
      }
    });
  }

  onBackToLogin()    { this.router.navigate(['/login']); }
  onForgotPassword() { this.router.navigate(['/forgot-password']); }
}
