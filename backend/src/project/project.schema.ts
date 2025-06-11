import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false }] })
  members: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  project_coordinator: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  team_leader: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  project_manager: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: false })
  notes: string;

  @Prop({ required: false })
  creds: string;

  @Prop({ required: false })
  additional_information: string;

  @Prop({ required: false })
  url_dev: string;

  @Prop({ required: false })
  url_live: string;

  @Prop({ required: false })
  url_staging: string;

  @Prop({ required: false })
  url_uat: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: 0 })
  sort_order: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
