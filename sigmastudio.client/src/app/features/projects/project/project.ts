import { inject, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProjectModel } from '../models/project.model';

@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class ProjectPage {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectsService);

  project = toSignal(
    this.route.params.pipe(
      switchMap(params => this.projectService.getBySlug(params['slug']))
    ),
    { initialValue: null }
  );
}
