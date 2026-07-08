import {Component, signal} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {Auth} from '../../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [
    NgIf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  model = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  showPassword   = signal(false);
  showConfirm    = signal(false);
  submitted      = signal(false);
  isLoading      = signal(false);      // ← fixed: was typed as `any`
  errorMessage   = signal('');
  successMessage = signal('');

  // ← inject AuthService and Router here
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

    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    console.log('Sending to API:', this.model);
    this.isLoading.set(true);

    this.authService.register(this.model).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        console.log('API Response:', response);
        if (response.success) {
          this.successMessage.set(response.message || 'Account created! Redirecting...');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMessage.set(response.message || 'Registration failed.');
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.log('API Error:', err);
        this.errorMessage.set(
          err.error?.message || 'Something went wrong. Please try again.'
        );
      }
    });
  }

  onSignIn() {
    this.router.navigate(['']);
  }
}
