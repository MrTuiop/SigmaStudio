import { Component, computed, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { ProfileModel } from '../models/profile.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class ProfileDashboardPage {
  defaultAvatarUrl = "assets/default-avatar.png";

  public readonly editingField = signal<keyof ProfileModel | null>(null);
  public readonly tempValue = signal<any>(null);
  public readonly profile = computed(() => this.profileService.profile());
  public readonly isEditing = computed(() => this.editingField() !== null);

  public readonly editableFields: Array<{
    key: keyof ProfileModel;
    label: string;
    type: 'text' | 'email' | 'date';
  }> = [
      { key: 'userName', label: 'Логин', type: 'text' },
      { key: 'firstName', label: 'Имя', type: 'text' },
      { key: 'lastName', label: 'Фамилия', type: 'text' },
      { key: 'email', label: 'Почта', type: 'email' },
      { key: 'dateOfBirth', label: 'Дата рождения', type: 'date' },
  ];
  constructor(public profileService: ProfileService) { }

  startEdit(field: keyof ProfileModel): void {
    const current = this.profile();
    if (!current) return;

    this.tempValue.set(current[field]);
    this.editingField.set(field);
  }

  saveField(): void {
    const field = this.editingField();
    const value = this.tempValue();

    if (!field || value === null) return;

    this.profileService.updateProfileField(field, value).subscribe({
      next: () => this.editingField.set(null),
      error: (err) => {
        console.error('Не удалось сохранить', err);
      }
    });
  }

  cancelEdit(): void {
    this.editingField.set(null);
    this.tempValue.set(null);
  }

  editAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.profileService.uploadProfileAvatar(file).subscribe({
      next: () => console.log('Аватарка обновлена'),
      error: (err) => console.log('Ошибка обновления аватарки', err)
    });

    input.value = '';
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
