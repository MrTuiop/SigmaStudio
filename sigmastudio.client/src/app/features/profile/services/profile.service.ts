import { Injectable, signal } from '@angular/core';
import { ProfileModel } from '../models/profile.model'
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = 'http://localhost:5292/api/profile';
  private _defaultIconPath: string = "C: \Users\tuiop\OneDrive\Рабочий стол\Icon.png";
  private _profile = signal<ProfileModel | null>(null);
  public readonly profile = this._profile.asReadonly();

  constructor(private http: HttpClient) { }

  loadProfile(): Observable<ProfileModel> {
    return this.http.get<ProfileModel>(this.apiUrl).pipe(
      tap(profile => this._profile.set(profile))
    );
  }
}
