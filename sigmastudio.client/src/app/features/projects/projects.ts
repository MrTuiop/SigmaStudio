import { inject, Component } from '@angular/core';
import { ProjectModel } from './models/project.model';
import { ProjectsService } from './services/projects.service';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsPage {
  private projectService = inject(ProjectsService);
  projects = toSignal(this.projectService.getAll(), { initialValue: [] as ProjectModel[] });
}
