import { Injectable, computed, effect, signal } from '@angular/core';
import { ProfileModel } from '../models/profile.model'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = '/api/profile';
  private _profile = signal<ProfileModel | null>(null);
  public readonly profile = this._profile.asReadonly();

  private _isLoading = signal(false);

  constructor(private http: HttpClient, private authService: AuthService) {
    effect(() => {
      const isLoggedIn = authService.isLoggedIn();
      const hasProfile = !!this._profile();
      const isLoading = this._isLoading();

      if (isLoggedIn && !hasProfile && !isLoading) {
        this._isLoading.set(true);
        this.loadProfile().subscribe({
          next: () => this._isLoading.set(false),
          error: () => this._isLoading.set(false)
        });
      } else if (!isLoggedIn) {
        this._profile.set(null);
        this._isLoading.set(false);
      }
    });
  }

  loadProfile(): Observable<ProfileModel> {
    if (!this.authService.isLoggedIn()) {
      console.warn('Пользователь не авторизован. Невозможно обновить профиль.');
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.get<ProfileModel>(this.apiUrl).pipe(
      tap(profile => this._profile.set(profile)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.warn('Токен недействителен, профиль не загружен.');
        } else {
          console.error('Ошибка сети при загрузке профиля', error);
        }
        return throwError(() => error);
      })
    );
  }

  updateProfileField<T extends keyof ProfileModel>(
    field: T,
    value: ProfileModel[T]
  ): Observable<ProfileModel> {
    const current = this._profile();
    if (!current) return throwError(() => new Error('Profile not loaded'));

    this._profile.set({ ...current, [field]: value });
    return this.http.patch<ProfileModel>(`${this.apiUrl}/field`, { field, value }).pipe(
      catchError((error: HttpErrorResponse) => {
        this._profile.set(current);
        console.error(`Ошибка обновления поля ${field}`, error);
        return throwError(() => error);
      })
    )
  }

  uploadProfileAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ avatarUrl: string }>(`${this.apiUrl}/avatar`, formData).pipe(
      tap(response => {
        this._profile.update(p => p ? { ...p, avatarUrl: response.avatarUrl } : null);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Ошибка загрузки аватарки", error);
        return throwError(() => error);
      })
    );
  }
}
