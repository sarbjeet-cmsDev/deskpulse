import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  sort_order: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assigned_to: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  report_to: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.ObjectId, ref: 'ProjectKanban'})
  kanban: MongooseSchema.Types.ObjectId;
  @Prop()
  due_date: Date;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  })
  priority: string;


    @Prop({
    type: String,
    enum: ['pending', 'inprogress', 'completed'],
    default: 'pending'
  })
  status: string;

  // estimated time in hours
  @Prop({ type: Number })
  estimated_time: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
