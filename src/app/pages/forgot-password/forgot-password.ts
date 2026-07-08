import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Auth} from '../../../services/auth';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  model = { email: '' };

  emailFocused   = false;
  submitted      = signal(false);
  isLoading      = signal(false);
  errorMessage   = signal('');
  successMessage = signal('');

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit(form: any) {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (form.invalid) return;

    this.isLoading.set(true);

    this.authService.forgotPassword(this.model).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set(
            response.message || 'Reset link sent! Please check your email.'
          );
        } else {
          this.errorMessage.set(response.message || 'Something went wrong.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Email not found. Please try again.'
        );
      }
    });
  }

  onBackToLogin() { this.router.navigate(['/login']); }
  onGoToReset() { this.router.navigate(['/reset-password']); }
}
