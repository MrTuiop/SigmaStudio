import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OnlineService {
  public onlineCount$ = interval(5000).pipe(
    switchMap(() => this.http.get<number>('/api/online-count'))
  );

  constructor(private http: HttpClient) { }
}
