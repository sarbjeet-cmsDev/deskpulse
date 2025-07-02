import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProjectKanban extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  sort_order: number;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;
}

export const ProjectKanbanSchema = SchemaFactory.createForClass(ProjectKanban);
