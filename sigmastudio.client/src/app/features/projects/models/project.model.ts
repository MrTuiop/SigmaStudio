export interface ProjectSection {
  title: string;
  content: string;
}

export interface ProjectModel {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  techStack: string[];
  screenshots: string[];
  sections: ProjectSection[];
}
