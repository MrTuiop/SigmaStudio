import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification-service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})

export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private sub: Subscription | null = null;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef // 👈 внедряем рефер
  ) { }

  ngOnInit(): void {
    this.sub = this.notificationService.notifications.subscribe(notifs => {
      this.notifications = notifs;
      this.cdr.detectChanges(); // 👈 принудительно обновляем шаблон при каждом изменении
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
