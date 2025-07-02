
import { Document, Types } from 'mongoose';


export interface ProjectKanban {
  title: string;
  sort_order: number;
  project: Types.ObjectId | string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectKanbanDocument extends ProjectKanban, Document {}