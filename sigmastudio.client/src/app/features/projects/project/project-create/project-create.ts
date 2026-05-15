// src/app/pages/project-create/project-create.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { ProjectModel } from '../../models/project.model';

function slugValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const valid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
  return valid ? null : { invalidSlug: true };
}

@Component({
  selector: 'app-project-create',
  standalone: false,
  templateUrl: './project-create.html',
  styleUrl: './project-create.css',
})
export class ProjectCreatePage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private projectsService = inject(ProjectsService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), slugValidator]],
    description: ['', Validators.required],
    imageUrl: [''],
    githubUrl: [''],
    techStack: this.fb.array([]),
    screenshots: this.fb.array([]),
    sections: this.fb.array([])
  });

  get techStack() { return this.form.get('techStack') as FormArray; }
  get screenshots() { return this.form.get('screenshots') as FormArray; }
  get sections() { return this.form.get('sections') as FormArray; }

  // Управление массивами
  addTechStack() { this.techStack.push(this.fb.control('')); }
  removeTechStack(i: number) { this.techStack.removeAt(i); }

  addScreenshot() { this.screenshots.push(this.fb.control('')); }
  removeScreenshot(i: number) { this.screenshots.removeAt(i); }

  addSection() {
    this.sections.push(this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    }));
  }
  removeSection(i: number) { this.sections.removeAt(i); }

  generateSlug() {
    const title = this.form.get('title')?.value as string;
    if (!title) return;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    this.form.patchValue({ slug });
  }

  private cleanFormValue<T>(value: any): T {
    const cleaned: any = {};

    Object.keys(value).forEach(key => {
      const val = value[key];

      if (val === null) {
        // null → undefined (или '' для строк, если предпочитаете)
        cleaned[key] = undefined;
      }
      else if (Array.isArray(val)) {
        // Рекурсивная очистка массивов
        cleaned[key] = val.map((item: any) =>
          typeof item === 'object' && item !== null
            ? this.cleanFormValue(item)
            : item
        ).filter((item: any) => item !== null && item !== ''); // убираем пустые
      }
      else if (typeof val === 'object' && val !== null) {
        // Рекурсивная очистка вложенных объектов
        cleaned[key] = this.cleanFormValue(val);
      }
      else {
        cleaned[key] = val;
      }
    });

    return cleaned as T;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // 👇 Очищаем значение перед отправкой
    const cleanValue = this.cleanFormValue<Partial<ProjectModel>>(this.form.value);

    this.projectsService.createProject(cleanValue).subscribe({
      next: (response) => {
        this.success.set('✅ Проект успешно создан!');
        this.router.navigate(['/projects', response.slug], {
          replaceUrl: true,
          state: { created: true }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.form.get('slug')?.setErrors({ slugExists: true });
          this.error.set(`Адрес "/projects/${this.form.get('slug')?.value}" уже используется`);
        } else {
          this.error.set(err.error?.message || 'Ошибка при создании проекта');
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/']); // или куда хотите вернуться
  }
}
