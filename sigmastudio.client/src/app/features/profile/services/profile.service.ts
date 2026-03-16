import { Injectable, signal } from '@angular/core';
import { ProfileModel } from '../models/profile.model'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = 'http://localhost:5292/api/profile';
  private _profile = signal<ProfileModel | null>(null);
  public readonly profile = this._profile.asReadonly();

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.isLoggedIn()) {
      this.loadProfile().subscribe({
        error: (err) => console.warn('Не удалось загрузить профиль (возможно, токен истек)', err)
      });
    }
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
}
