import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AcceptanceLevelEnum, PriorityEnum, TaskStatusEnum, TaskTypeEnum } from './task.interface';

export type TaskDocument = Task & Document;


@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(TaskTypeEnum),
    required: true,
  })
  type: TaskTypeEnum;

  @Prop()
  type_weight: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  sort_order: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assigned_to: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  report_to: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProjectKanban' })
  kanban: MongooseSchema.Types.ObjectId;

  @Prop()
  due_date: Date;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({
    type: String,
    enum: Object.values(PriorityEnum),
    default: PriorityEnum.MEDIUM,
  })
  priority: PriorityEnum;

  @Prop({
    type: String,
    enum: Object.values(TaskStatusEnum),
    default: TaskStatusEnum.BACKLOG,
  })
  status: TaskStatusEnum;

  @Prop({ type: Number })
  estimated_time: number;

  @Prop({
    type: String,
    enum: Object.values(AcceptanceLevelEnum),
  })
  acceptance: AcceptanceLevelEnum;

  @Prop()
  acceptance_weight: number;

  @Prop({ type: Number })
  revision: number; // ✅ fixed typo

}

export const TaskSchema = SchemaFactory.createForClass(Task);
