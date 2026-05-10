import { inject, Component, effect, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs'; // 👈 Добавили map
import { ProjectModel } from '../models/project.model';
import { Title } from '@angular/platform-browser';

// 👇 Интерфейс для данных маршрута (типизируем resolve)
interface ProjectRouteData {
  project: ProjectModel | null;
  pageTitle?: string;
}

@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class ProjectPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);

  project = toSignal(
    this.route.data.pipe(
      map((data) => (data as ProjectRouteData).project)
    ),
    { initialValue: null as ProjectModel | null }
  );

  browserTitle = computed(() => {
    const p = this.project();
    return p?.title ? `${p.title} - Просмотр проекта` : 'Загрузка проекта...';
  });

  constructor() {
    effect(() => {
      this.titleService.setTitle(this.browserTitle());
    });

    effect(() => {
      const data = this.route.snapshot.data as ProjectRouteData;
      if (data?.project === null) {
        this.router.navigate(['/projects']);
      }
    });
  }
}
