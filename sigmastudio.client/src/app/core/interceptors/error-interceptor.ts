import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Произошла ошибка сервера';

        if (error.error instanceof ErrorEvent) {
          // 👇 Клиентская/сетевая ошибка (нет соединения, CORS и т.д.)
          message = 'Ошибка сети: проверьте подключение к интернету';
          console.error('Network error:', error.error);
        } else {
          // 👇 HTTP-ошибка от сервера (4xx/5xx)
          switch (error.status) {
            case 400:
              message = this.extractProblemDetails(error) || 'Неверные данные запроса';
              break;
            case 401:
              message = 'Требуется авторизация';
              // Опционально: редирект на логин
              break;
            case 403:
              message = 'Доступ запрещён';
              break;
            case 404:
              message = 'Ресурс не найден';
              break;
            case 409:
              message = this.extractProblemDetails(error) || 'Конфликт данных';
              break;
            case 500:
              message = 'Внутренняя ошибка сервера';
              break;
            default:
              message = error.error?.message || `Ошибка ${error.status}: ${error.statusText}`;
          }
        }

        // Показываем уведомление
        this.notificationService.showError(message);

        // Пробрасываем ошибку дальше, чтобы компонент мог обработать её при необходимости
        return throwError(() => error);
      })
    );
  }

  /**
   * Парсит стандартный ответ ASP.NET Core ProblemDetails
   * https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors?view=aspnetcore-8.0#problemdetails
   */
  private extractProblemDetails(error: HttpErrorResponse): string | null {
    if (error.error && typeof error.error === 'object') {
      // Вариант 1: { errors: { fieldName: ['msg1', 'msg2'] } }
      if (error.error.errors) {
        const messages: string[] = [];
        Object.values(error.error.errors).forEach((val: any) => {
          if (Array.isArray(val)) messages.push(...val);
        });
        return messages.join('\n');
      }
      // Вариант 2: { message: '...', detail: '...' } или { title: '...' }
      return error.error.message || error.error.detail || error.error.title || null;
    }
    return null;
  }
}
