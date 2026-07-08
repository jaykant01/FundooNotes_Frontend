import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResponseDTO {
  success: boolean;
  message: string;
  data: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.baseUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.baseUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.baseUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.baseUrl}/reset-password`, data);
  }
}
