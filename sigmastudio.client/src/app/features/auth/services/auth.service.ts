import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { AuthResponse } from '../models/auth-response.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5292/api/auth'; // Твой API
  private readonly tokenKey = 'auth_token';
  private jwtHelper = new JwtHelperService();

  private _isLoggedIn = signal<boolean>(false);
  private _userName = signal<string | null>(null);
  private _userEmail = signal<string | null>(null);
  private _userRoles = signal<string[]>([]);

  public readonly isLoggedIn = this._isLoggedIn.asReadonly();
  public readonly userName = this._userName.asReadonly();
  public readonly userEmail = this._userEmail.asReadonly();
  public readonly userRoles = this._userRoles.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.updateAuthState();
  }

  public updateAuthState(): void {
    const token = this.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);

      this._isLoggedIn.set(true);
      this._userName.set(decoded['userName'] || null);
      this._userEmail.set(decoded['email'] || null);
      this._userRoles.set(decoded['role'] || []);
    } else {
      this._isLoggedIn.set(false);
      this._userName.set(null);
      this._userEmail.set(null);
      this._userRoles.set([]);
    }
  }

  register(model: RegisterModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, model);
  }

  login(model: LoginModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, model).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.updateAuthState();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.updateAuthState();
    this.router.navigate(['/']);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: string): boolean {
    return this._userRoles().includes(role);
  }

  //getUserProfile(): { email: string | null; userName: string | null; roles: string[] } | null {
  //  if (!this._isLoggedIn()) return null;

  //  return {
  //    email: this._userEmail(),
  //    userName: this._userName(),
  //    roles: this._userRoles()
  //  };
  //}
}
