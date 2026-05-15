import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProjectModel } from '../models/project.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/projects';

  getAll() {
    return this.http.get<ProjectModel[]>(this.apiUrl);
  }

  getById(id: string | number) {
    return this.http.get<ProjectModel>(`${this.apiUrl}/${id}`);
  }

  getBySlug(slug: string) {
    return this.http.get<ProjectModel>(`${this.apiUrl}/${slug}`);
  }

  updateProject(slug: string, data: any): Observable<ProjectModel> {
    return this.http.put<ProjectModel>(`${this.apiUrl}/${slug}`, data);
  }

  createProject(dto: Partial<ProjectModel>): Observable<ProjectModel> {
    return this.http.post<ProjectModel>(this.apiUrl, dto);
  }
}
