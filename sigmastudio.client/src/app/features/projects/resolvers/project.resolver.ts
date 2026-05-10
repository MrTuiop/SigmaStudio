import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { ProjectModel } from '../models/project.model';
import { catchError, of } from 'rxjs';

export const ProjectResolver: ResolveFn<ProjectModel | null> = (route) => {
  const projectService = inject(ProjectsService);
  const slug = route.paramMap.get('slug');

  if (!slug) {
    return of(null);
  }

  return projectService.getBySlug(slug).pipe(
    catchError((error) => {
      console.error('Ошибка резолвера:', error);
      return of(null);
    })
  );
};
