import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Auth} from '../../../services/auth';

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
  model = {
    email: '',
    password: '',
  };

  emailFocused    = false;
  passwordFocused = false;

  showPassword   = signal(false);
  submitted      = signal(false);
  isLoading      = signal(false);
  errorMessage   = signal('');

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  togglePassword() { this.showPassword.update(v => !v); }

  onSubmit(form: any) {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (form.invalid) return;

    console.log('Sending to API:', this.model);
    this.isLoading.set(true);

    this.authService.login(this.model).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        console.log('API Response:', response);

        if (response.success) {
          this.authService.saveToken(response.data.token);  // ← save JWT token
          this.router.navigate(['/dashboard']);              // ← redirect
        } else {
          this.errorMessage.set(response.message || 'Login failed.');
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.log('API Error:', err);
        this.errorMessage.set(
          err.error?.message || 'Invalid email or password.'
        );
      }
    });
  }

  onCreateAccount()  { this.router.navigate(['/register']); }
  onForgotPassword() { this.router.navigate(['/forgot-password']); }
}
