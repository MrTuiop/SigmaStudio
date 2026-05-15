import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications = this.notifications$.asObservable();

  private queue: { type: 'success' | 'error'; message: string }[] = [];
  private timeouts = new Map<number, any>();
  private nextId = 1;
  private readonly MAX_VISIBLE = 3;
  private readonly AUTO_CLOSE_MS = 3000;

  showSuccess(message: string): void { this.push('success', message); }
  showError(message: string): void { this.push('error', message); }

  private push(type: 'success' | 'error', message: string): void {
    const current = this.notifications$.value;
    if (current.length < this.MAX_VISIBLE) {
      this.add(type, message);
    } else {
      this.queue.push({ type, message });
    }
  }

  private add(type: 'success' | 'error', message: string): void {
    const id = this.nextId++;
    this.notifications$.next([...this.notifications$.value, { id, type, message }]);

    // Обычный setTimeout теперь безопасен, т.к. обновление шаблона берёт на себя ChangeDetectorRef
    const timerId = setTimeout(() => this.remove(id), this.AUTO_CLOSE_MS);
    this.timeouts.set(id, timerId);
  }

  private remove(id: number): void {
    clearTimeout(this.timeouts.get(id));
    this.timeouts.delete(id);

    const updated = this.notifications$.value.filter(n => n.id !== id);
    this.notifications$.next(updated);

    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      this.add(next.type, next.message);
    }
  }
}
