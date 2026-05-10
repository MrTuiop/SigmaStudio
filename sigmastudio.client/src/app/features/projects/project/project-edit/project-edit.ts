import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { ProjectModel } from '../../models/project.model';

function slugValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null; // required validator обработает пустое значение
  const valid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
  return valid ? null : { invalidSlug: true };
}

@Component({
  selector: 'app-project-edit',
  standalone: false,
  templateUrl: './project-edit.html',
  styleUrl: './project-edit.css',
})
export class ProjectEditPage {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectsService = inject(ProjectsService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Резолвер уже загрузил проект в data['project']
  public project = this.route.snapshot.data['project'] as ProjectModel;
  oldSlug = this.project.slug;

  form = this.fb.group({
    title: [this.project.title, Validators.required],
    slug: [this.project.slug, [Validators.required, Validators.minLength(3), Validators.maxLength(100), slugValidator]],
    description: [this.project.description, Validators.required],
    imageUrl: [this.project.imageUrl],
    githubUrl: [this.project.githubUrl],
    techStack: this.fb.array(this.project.techStack.map(t => this.fb.control(t))),
    screenshots: this.fb.array(this.project.screenshots.map(s => this.fb.control(s))),
    sections: this.fb.array(this.project.sections.map(s =>
      this.fb.group({ title: [s.title, Validators.required], content: [s.content, Validators.required] })
    ))
  });

  // Геттеры для удобства в шаблоне
  get techStack() { return this.form.get('techStack') as FormArray; }
  get screenshots() { return this.form.get('screenshots') as FormArray; }
  get sections() { return this.form.get('sections') as FormArray; }

  // Управление массивами
  addTechStack() { this.techStack.push(this.fb.control('')); }
  removeTechStack(i: number) { this.techStack.removeAt(i); }

  addScreenshot() { this.screenshots.push(this.fb.control('')); }
  removeScreenshot(i: number) { this.screenshots.removeAt(i); }

  addSection() {
    this.sections.push(this.fb.group({ title: [''], content: [''] }));
  }
  removeSection(i: number) { this.sections.removeAt(i); }

  generateSlug() {
    const title = this.form.get('title')?.value as string;
    if (!title) return;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')      // удаляем спецсимволы
      .replace(/[\s_]+/g, '-')       // пробелы и подчёркивания → дефис
      .replace(/-+/g, '-')           // множественные дефисы → один
      .replace(/^-|-$/g, '');        // обрезаем дефисы по краям

    this.form.patchValue({ slug });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    // 👇 Отправляем на обновление, используя СТАРЫЙ slug в URL
    this.projectsService.updateProject(this.oldSlug, this.form.value).subscribe({
      next: (response) => {
        // 👇 Перенаправляем на НОВЫЙ slug
        this.router.navigate(['/projects', response.slug], {
          replaceUrl: true, // заменяем историю, чтобы кнопка "Назад" не вернула на форму
          state: { updated: true }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.form.get('slug')?.setErrors({ slugExists: true });
          this.error.set(`Адрес "/projects/${this.form.get('slug')?.value}" уже используется`);
        } else {
          this.error.set(err.error?.message || 'Ошибка при сохранении изменений');
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/projects', this.project.slug]);
  }
}
