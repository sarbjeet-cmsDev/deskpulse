export interface Project {
  _id: string;
  title: string;
}

export interface Task {
  _id: string;
  title: string;
}

export interface Comment {
  _id: string;
  content: string;
  task?: string;
  project?: string;
}

export interface SearchResponse {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
}
