import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap, catchError, throwError } from "rxjs";
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RequestResetRequest,
  ResetPasswordRequest,
} from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "http://localhost:3000";
  private readonly TOKEN_KEY = "jwt_token";
  private readonly USER_KEY = "user_data";

  private userSignal = signal<User | null>(this.getStoredUser());

  user = this.userSignal.asReadonly();
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  isAdmin = computed(() => this.userSignal()?.role === "ADMIN");

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getMe() {
    return this.http.get<User>(`${this.API_URL}/auth/me`);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Login failed"),
          );
        }),
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, data)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Registration failed"),
          );
        }),
      );
  }

  requestPasswordReset(data: RequestResetRequest): Observable<void> {
    return this.http
      .post<void>(`${this.API_URL}/auth/request-reset`, data)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Request failed"),
          );
        }),
      );
  }

  resetPassword(data: ResetPasswordRequest): Observable<void> {
    return this.http
      .post<void>(`${this.API_URL}/auth/reset-password`, data)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Reset failed"),
          );
        }),
      );
  }

  loadUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    this.getMe().subscribe({
      next: (user) => {
        this.userSignal.set(user);
      },
      error: () => {
        this.logout();
      },
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(["/login"]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`).pipe(
      tap((user) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.userSignal.set(user);
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error?.message || "Failed to get user"),
        );
      }),
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    if (response.user) {
      this.userSignal.set(response.user);
    } else {
      // fallback caso não venha user
      this.loadUser();
    }
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
