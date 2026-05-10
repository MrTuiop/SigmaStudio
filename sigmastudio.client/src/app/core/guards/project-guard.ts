import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectsService } from '../../features/projects/services/projects.service';
import { catchError, map, of } from 'rxjs';

export const ProjectGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const projectService = inject(ProjectsService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug');

  if (!slug) {
    return router.createUrlTree(['/projects']);
  }

  return projectService.getBySlug(slug).pipe(
    map(project => {
      if (!project) {
        return router.createUrlTree(['/projects']);
      }
      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(['/projects']));
    })
  );
};
