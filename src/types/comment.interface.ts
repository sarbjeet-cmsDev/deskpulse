export interface IComment {
  _id: string;
  content: string;
  task: string;
  mentioned?: string[];
  parent_comment?: string;
  created_by: string;
  mentioned_users: any;
  createdAt?: string;
  updatedAt?: string;
  UserId?:any
}

export interface CreateCommentDto {
  content: string;
  task: string;
  mentioned?: string[];
  parent_comment?: string;
  created_by: string;
  code:string;
}

export interface UpdateCommentDto {
  content?: string;
  task?: string;
  mentioned?: string[];
  parent_comment?: string;
  created_by?: string;
}

export interface ICommentResponse {
  data: IComment[];
  total: number;
  page: number;
  limit: number;
}