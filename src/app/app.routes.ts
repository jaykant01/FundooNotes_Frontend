import { Routes } from '@angular/router';
import {Signup} from './pages/signup/signup';
import {Signin} from './pages/signin/signin';
import {ForgotPassword} from './pages/forgot-password/forgot-password';
import {ResetPassword} from './pages/reset-password/reset-password';
import {Dashboard} from './components/dashboard/dashboard';
import {authGuard} from '../guards/auth-guard';

export const routes: Routes = [
  {path: '',          redirectTo: 'login',     pathMatch: 'full'},
  { path: 'login',     component: Signin },
  {path: 'register', component: Signup},
  { path: 'forgot-password', component: ForgotPassword },
  {path: 'reset-password', component: ResetPassword},
  {path: 'dashboard', component: Dashboard , canActivate: [authGuard]},
  { path: '**',        redirectTo: 'login' },
];
