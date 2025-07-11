export interface IProject {
  _id?: string;  
  code: string;
  title: string;
  description?: string;
  users?: string[];  

  project_coordinator?: string;  
  project_manager?: string;     
  team_leader?: string;          

  notes?: string;
  creds?: string;
  additional_information?: string;

  url_dev?: string;
  url_live?: string;
  url_staging?: string;
  url_uat?: string;

  is_active: boolean;
  sort_order?: number;

  createdAt?: string; 
  updatedAt?: string;  

  project?: string;   
  report_to?: string;  
  avatar?: string;     

  created_by?: string;  
  updated_by?: string;  
}

export interface IProjectResponse {
  data: IProject[];
  total: number;
  page: number;
  limit: number;
}
